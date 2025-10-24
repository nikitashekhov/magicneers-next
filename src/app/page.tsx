
import CertificateCardPublic from '@/components/certificate-card-public';
import UserAvatar from '@/components/user-avatar';
import { prisma } from '@/lib/prisma';
import { Certificate } from '@/types/index';
import Link from 'next/link';

export default async function Home() {

  const certificates = await prisma.certificate.findMany({
    include: {
      smilePhoto: true,
      digitalCopy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Link href="/" className="text-blue-600">Magicneers</Link> Сертификаты
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <UserAvatar />
            </div>
          </div>
        </div>

        {/* Сетка сертификатов */}
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Сертификаты отсутствуют
            </h3>
            <p className="text-gray-500">
              Сертификаты будут отображаться здесь после их создания
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCardPublic key={certificate.id} certificate={certificate as unknown as Certificate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
