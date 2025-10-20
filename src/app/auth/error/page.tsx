"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Error",
          message: "There is a problem with the server configuration.",
          suggestion: "Please try again later or contact support if the problem persists."
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          message: "You do not have permission to sign in.",
          suggestion: "Please contact your administrator if you believe this is an error."
        }
      case "Verification":
        return {
          title: "Link Expired",
          message: "The sign in link is no longer valid.",
          suggestion: "It may have been used already or it may have expired. Please request a new one."
        }
      case "Default":
      default:
        return {
          title: "Unable to Sign In",
          message: "An error occurred during the sign in process.",
          suggestion: "Please try again or contact support if the problem persists."
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {errorInfo.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {errorInfo.message}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {errorInfo.suggestion}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/auth/signin" className="w-full">
            <Button className="w-full flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {error === "Verification" && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Need a new verification code?
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
              If you need a new OTP code, you can request one by signing in again.
            </p>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20">
                Request New Code
              </Button>
            </Link>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Error code: {error || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  )
}
