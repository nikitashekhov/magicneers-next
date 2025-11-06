import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CertificateCard from '@/components/certificate-card';

export default async function Dashboard() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as { role?: string }).role;

  // Если пользователь admin, перенаправляем на /certificates
  if (userRole === 'admin') {
    redirect('/certificates');
  }

  // Получаем сертификаты для пользователя с ролью user
  let certificates: any[] = [];
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
    <div className="mx-auto w-full md:w-1/2">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ваш цифровой сертификат Magicneers
        </h2> */}
            
      {certificates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Сертификаты не найдены
          </h3>
          <p className="text-gray-600 mb-6">
            У вас пока нет сертификатов.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
