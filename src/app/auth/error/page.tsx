"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Ошибка сервера",
          message: "Проблема с конфигурацией сервера.",
          suggestion: "Попробуйте позже или обратитесь в поддержку, если проблема сохраняется."
        }
      case "AccessDenied":
        return {
          title: "Доступ запрещен",
          message: "У вас нет разрешения на вход в систему.",
          suggestion: "Обратитесь к администратору, если считаете, что это ошибка."
        }
      case "Verification":
        return {
          title: "Ссылка истекла",
          message: "Ссылка для входа больше не действительна.",
          suggestion: "Возможно, она уже была использована или истекла. Запросите новую."
        }
      case "Default":
      default:
        return {
          title: "Невозможно войти",
          message: "Произошла ошибка в процессе входа в систему.",
          suggestion: "Попробуйте снова или обратитесь в поддержку, если проблема сохраняется."
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
              Попробовать снова
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>

        {error === "Verification" && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Нужен новый код подтверждения?
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
              Если вам нужен новый OTP код, вы можете запросить его, войдя в систему снова.
            </p>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20">
                Запросить новый код
              </Button>
            </Link>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Код ошибки: {error || "Неизвестно"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
