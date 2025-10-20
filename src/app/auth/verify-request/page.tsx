import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent you a 6-digit verification code. Please check your email and enter the code to sign in.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Link href="/auth/signin">
              <Button className="w-full">
                Enter Verification Code
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-500">
                try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
