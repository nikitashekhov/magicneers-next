import { prisma } from "@/lib/prisma";
import { Metadata } from "next"

export async function generateMetadata(
    { params }: {params: Promise<{ id: string }>}
  ): Promise<Metadata> {
  
    const id = (await params).id

    const certificate = await prisma.certificate.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
      },
    });
    
    return {
      title: `${certificate?.title}`,
      description: `Цифровой сертификат ${certificate?.title} сверхтонких керамических виниров ручной работы без препарирования зубов`,
      keywords: ["сертификаты", "Magicneers", "AestheticA", "виниры"],
      openGraph: {
        title: `${certificate?.title}`,
        description: `Цифровой сертификат ${certificate?.title} сверхтонких керамических виниров ручной работы без препарирования зубов`,
        url: `https://verify.magicneers.com/view/${id}`,
        siteName: 'Magicneers',
        images: [
          {
            url: '/images/og-image.jpg',
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
    }
  }

export default function ViewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    )
}