import { prisma } from "./prisma"

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date(), // Token hasn't expired
        },
      },
    })

    if (!verificationToken) {
      return false
    }

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    })

    return true
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

export async function generateOTP(email: string): Promise<string> {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store OTP in database with expiration (10 minutes)
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: otp,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    },
  })

  return otp
}
