import { prisma } from "./prisma"

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Max OTP generation requests per email
  MAX_OTP_REQUESTS: 3, // Max 3 requests
  OTP_REQUEST_WINDOW: 15 * 60 * 1000, // 15 minutes window
  
  // Max OTP verification attempts per email
  MAX_VERIFICATION_ATTEMPTS: 5, // Max 5 attempts
  VERIFICATION_WINDOW: 15 * 60 * 1000, // 15 minutes window
} as const

// In-memory rate limit storage
// For production, consider using Redis or a database table
interface RateLimitEntry {
  email: string
  timestamps: number[]
  type: "request" | "verification"
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private getKey(email: string, type: "request" | "verification"): string {
    return `${email}:${type}`
  }

  private cleanup(): void {
    const now = Date.now()
    const window = Math.max(
      RATE_LIMIT_CONFIG.OTP_REQUEST_WINDOW,
      RATE_LIMIT_CONFIG.VERIFICATION_WINDOW
    )

    for (const [key, entry] of this.storage.entries()) {
      // Remove timestamps outside the window
      entry.timestamps = entry.timestamps.filter(
        (timestamp) => now - timestamp < window
      )

      // Remove entry if no timestamps left
      if (entry.timestamps.length === 0) {
        this.storage.delete(key)
      }
    }
  }

  checkRateLimit(
    email: string,
    type: "request" | "verification"
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const key = this.getKey(email, type)
    const now = Date.now()
    
    const config = type === "request" 
      ? { max: RATE_LIMIT_CONFIG.MAX_OTP_REQUESTS, window: RATE_LIMIT_CONFIG.OTP_REQUEST_WINDOW }
      : { max: RATE_LIMIT_CONFIG.MAX_VERIFICATION_ATTEMPTS, window: RATE_LIMIT_CONFIG.VERIFICATION_WINDOW }

    let entry = this.storage.get(key)
    
    if (!entry) {
      entry = { email, timestamps: [], type }
      this.storage.set(key, entry)
    }

    // Remove old timestamps outside the window
    entry.timestamps = entry.timestamps.filter(
      (timestamp) => now - timestamp < config.window
    )

    const count = entry.timestamps.length
    const allowed = count < config.max

    if (allowed) {
      entry.timestamps.push(now)
    }

    // Calculate reset time (oldest timestamp + window)
    const resetAt = entry.timestamps.length > 0
      ? Math.min(...entry.timestamps) + config.window
      : now + config.window

    return {
      allowed,
      remaining: Math.max(0, config.max - count - (allowed ? 1 : 0)),
      resetAt,
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.storage.clear()
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter()

// Cleanup on process exit (only in Node.js environment)
if (typeof process !== "undefined" && process.env && typeof process.on === "function") {
  const cleanup = () => {
    try {
      rateLimiter.destroy()
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
  
  process.on("SIGTERM", cleanup)
  process.on("SIGINT", cleanup)
}

export class RateLimitError extends Error {
  constructor(
    public remaining: number,
    public resetAt: number,
    message: string
  ) {
    super(message)
    this.name = "RateLimitError"
  }
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    // Check rate limit for verification attempts
    const rateLimit = rateLimiter.checkRateLimit(email, "verification")
    
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetAt).toISOString()
      throw new RateLimitError(
        rateLimit.remaining,
        rateLimit.resetAt,
        `Too many verification attempts. Please try again after ${resetTime}. Remaining attempts: ${rateLimit.remaining}`
      )
    }

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
    if (error instanceof RateLimitError) {
      throw error
    }
    console.error("Error verifying OTP:", error)
    return false
  }
}

export async function generateOTP(email: string): Promise<string> {
  // Check rate limit for OTP requests
  const rateLimit = rateLimiter.checkRateLimit(email, "request")
  
  if (!rateLimit.allowed) {
    const resetTime = new Date(rateLimit.resetAt).toISOString()
    throw new RateLimitError(
      rateLimit.remaining,
      rateLimit.resetAt,
      `Too many OTP requests. Please try again after ${resetTime}. Remaining requests: ${rateLimit.remaining}`
    )
  }

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
