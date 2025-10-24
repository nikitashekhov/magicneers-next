import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for modern development
  experimental: {
    typedEnv: true, // Enable typed environment variables
    authInterrupts: true,
  },
  
  // Enable typed routes (moved from experimental)
  typedRoutes: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      new URL('https://62b5d53dd2e1-magicneers-cloud.s3.ru1.storage.beget.cloud/**'),
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
