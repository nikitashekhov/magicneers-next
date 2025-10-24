import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CertificateCard from '@/components/certificate-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Certificate } from '@/types';

export default async function Dashboard() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any).role;

  // Если пользователь admin, перенаправляем на /certificates
  if (userRole === 'admin') {
    redirect('/certificates');
  }

  // Получаем сертификаты для пользователя с ролью user
  let certificates: Certificate[] = [];
  try {
    certificates = await prisma.certificate.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        user: true,
        smilePhoto: true,
        digitalCopy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">

          {/* Сертификаты пользователя */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ваши сертификаты
            </h2>
            
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Сертификаты не найдены
                </h3>
                <p className="text-gray-600 mb-6">
                  У вас пока нет созданных сертификатов.
                </p>
                <Link href="/certificates/create">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Создать первый сертификат
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
