import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Цифровые сертификаты Magicneers',
    short_name: 'Сертификаты Magicneers',
    description: 'Цифровые сертификаты сверхтонких керамических виниров ручной работы без препарирования зубов',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}