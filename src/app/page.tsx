'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useLocalStorage('user-name', '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <main className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
        <Image
              className="mx-auto mb-8 dark:invert"
          src="/next.svg"
          alt="Next.js logo"
              width={200}
              height={42}
          priority
        />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Magic Neers
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Modern Next.js 15 with TypeScript, Tailwind CSS, and App Router
            </p>
            
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
                    <Link href="/dashboard">
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

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">TypeScript</h3>
              <p className="text-gray-600 dark:text-gray-300">Full type safety with modern TypeScript configuration</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Turbopack</h3>
              <p className="text-gray-600 dark:text-gray-300">Lightning-fast development with Next.js 15 Turbopack</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">App Router</h3>
              <p className="text-gray-600 dark:text-gray-300">Modern routing with React Server Components</p>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interactive Demo</h2>
            
            <div className="space-y-6">
              <div>
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {name && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Hello, <span className="font-semibold">{name}</span>! 👋
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Search (Debounced)"
                  placeholder="Type something..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {debouncedSearchTerm && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Searching for: <span className="font-semibold">{debouncedSearchTerm}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="link">Link Button</Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tech Stack</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Next.js 15',
                'React 19',
                'TypeScript',
                'Tailwind CSS',
                'NextAuth.js',
                'OTP Auth',
                'Prisma',
                'ESLint',
                'Prettier',
                'Turbopack',
                'App Router'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
        </div>
      </main>
      </div>
    </div>
  );
}
