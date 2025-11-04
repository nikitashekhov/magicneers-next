import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import nodemailer from "nodemailer"
import { generateOTP, verifyOTP, RateLimitError } from "@/lib/otp-verification"
import { prisma } from "@/lib/prisma"

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Custom email provider with OTP
const customEmailProvider = EmailProvider({
  id: "email-otp",
  name: "Email OTP",
  server: {
    host: process.env.EMAIL_SERVER_HOST!,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER!,
      pass: process.env.EMAIL_SERVER_PASSWORD!,
    },
  },
  from: process.env.EMAIL_FROM!,
  maxAge: 10 * 60, // 10 minutes
  async sendVerificationRequest(params) {
    const { identifier: email, url } = params
    
    try {
      // Generate and store OTP (with rate limiting)
      const otp = await generateOTP(email)

      // Send OTP email with magic link
      await transporter.sendMail({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject: `Ваш код подтверждения для сертификатов Magicneers`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/magicneers.png" alt="Logo" style="width: 140px; height: 24px; margin-bottom: 20px;">
            <h2 style="color: #333;">Ваш код подтверждения</h2>
            <p>Используйте следующий код для входа в систему:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              Этот код действителен в течение 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.
            </p>
          </div>
        `,
        text: `Ваш код подтверждения: ${otp}\n\nЭтот код действителен в течение 10 минут.\n\nИли нажмите на эту ссылку для входа: ${url}`,
      })
    } catch (error) {
      // Handle rate limiting errors
      if (error instanceof RateLimitError) {
        const resetTime = new Date(error.resetAt).toLocaleString("ru-RU")
        throw new Error(
          `Слишком много запросов кода. Попробуйте снова после ${resetTime}. Осталось попыток: ${error.remaining}`
        )
      }
      // Re-throw other errors
      throw error
    }
  },
})

// OTP Credentials Provider
const otpProvider = CredentialsProvider({
  id: "otp",
  name: "OTP",
  credentials: {
    email: { label: "Email", type: "email" },
    otp: { label: "OTP", type: "text" },
  },
  async authorize(credentials): Promise<{ id: string; email: string; name: string | null; role: string } | null> {
    if (!credentials?.email || !credentials?.otp) {
      return null
    }

    const email = credentials.email as string
    const otp = credentials.otp as string

    try {
      // Verify the OTP (with rate limiting)
      const isValid = await verifyOTP(email, otp)
      if (!isValid) {
        return null
      }

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: email.split('@')[0] || null,
          },
        })
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    } catch (error) {
      // Handle rate limiting errors
      if (error instanceof RateLimitError) {
        // Return null to indicate authentication failure
        // The error will be logged but not exposed to client for security
        console.error("Rate limit exceeded for OTP verification:", email)
        return null
      }
      // Re-throw other errors
      throw error
    }
  },
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // @ts-expect-error - EmailProvider type mismatch with NextAuth v5
  providers: [customEmailProvider, otpProvider],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ account }) {
      // For email OTP, we need to verify the OTP
      if (account?.provider === "email-otp") {
        // This will be handled by the custom verification page
        return true
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email || null
        token.name = user.name || null
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})
