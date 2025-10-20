"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("email-otp", {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to send OTP. Please try again.")
      } else {
        setStep("otp")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Use NextAuth's signIn with the OTP credentials provider
      const result = await signIn("otp", {
        email,
        otp,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid or expired OTP. Please try again.")
      } else if (result?.ok) {
        // Redirect to dashboard after successful sign-in
        window.location.href = "/dashboard"
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp("")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === "email" ? "Sign in to your account" : "Enter verification code"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "email"
              ? "Enter your email address to receive a verification code"
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit}
        >
          <div className="space-y-4">
            {step === "email" ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="otp" className="sr-only">
                  Verification code
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : step === "email" ? "Send Code" : "Verify Code"}
            </Button>

            {step === "otp" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToEmail}
                className="w-full"
              >
                Back to Email
              </Button>
            )}
          </div>

          {step === "otp" && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep("email")
                  handleEmailSubmit()
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Resend code
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
