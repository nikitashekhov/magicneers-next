import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "cyrillic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://verify.magicneers.com'),
  title: {
    default: "Сертификаты Magicneers",
    template: "%s | Сертификаты Magicneers"
  },
  description: "Сертификаты Magicneers",
  keywords: ["сертификаты", "Magicneers", "AestheticA"],
  openGraph: {
    title: "Сертификаты Magicneers",
    description: "Сертификаты Magicneers",
    url: 'https://verify.magicneers.com',
    siteName: 'Magicneers',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${playfairDisplay.variable} ${inter.className} antialiased`}
      >
        <SessionProvider>
          {children as React.ReactNode}
        </SessionProvider>
      </body>
    </html>
  );
}
