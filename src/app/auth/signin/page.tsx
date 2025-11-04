"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { status, data: session } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "authenticated") {
      if ((session?.user as { role?: string }).role === "admin") {
        router.push("/certificates")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, session, router])

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
        setError("Не удалось отправить код. Попробуйте еще раз.")
      } else {
        setStep("otp")
      }
    } catch {
      setError("Произошла ошибка. Попробуйте еще раз.")
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
        setError("Неверный или истекший код. Попробуйте еще раз.")
      } else if (result?.ok) {
        // Redirect to dashboard after successful sign-in
        window.location.href = "/dashboard"
      }
    } catch {
      setError("Произошла ошибка. Попробуйте еще раз.")
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
            <h1 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Link href="/">
                    <img src="/images/magicneers.svg" alt="Magicneers" width={140} height={24} />
                </Link> 
                <span className="font-bold text-gray-900 font-playfair-display">Сертификаты</span>
            </h1>
        </div>
        <div>
          <h2 className="mt-6 text-xl font-extrabold text-gray-900">
            {step === "email" ? "Войдите в свой аккаунт" : "Введите код подтверждения"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "email"
              ? "Введите ваш email адрес для получения кода подтверждения"
              : `Мы отправили 6-значный код на ${email}`}
          </p>
        </div>

        <form
          className="mt-2 space-y-6"
          onSubmit={step === "email" ? handleEmailSubmit : handleOtpSubmit}
        >
          <div className="space-y-4">
            {step === "email" ? (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email адрес
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email адрес"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="otp" className="sr-only">
                  Код подтверждения
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
              {isLoading ? "Обработка..." : step === "email" ? "Отправить код" : "Подтвердить код"}
            </Button>

            {step === "otp" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToEmail}
                className="w-full text-black"
              >
                Назад к Email
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
                Отправить код повторно
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
