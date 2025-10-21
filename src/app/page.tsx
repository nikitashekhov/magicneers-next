'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <main className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Magicneers
            </h1>
            
            {/* Authentication Section */}
            <div className="mb-8">
              {status === "loading" ? (
                <div className="animate-pulse bg-gray-200 h-10 w-32 mx-auto rounded"></div>
              ) : session ? (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Welcome back, <span className="font-semibold">{session.user?.email}</span>! 🎉
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link href={((session.user as { role?: string }).role === "admin") ? "/certificates" : "/dashboard"}>
                      <Button>Go to Dashboard</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    Get started with OTP authentication
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link href="/auth/signin">
                      <Button>Sign In with OTP</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
      </main>
      </div>
    </div>
  );
}
