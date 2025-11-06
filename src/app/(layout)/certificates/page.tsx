import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CertificatesAdminList from '@/components/admin-certificates-list';


export default async function CertificatesPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect('/auth/signin');
  }

  if ((session.user as { role?: string }).role !== 'admin') {
    redirect('/dashboard');
  }

  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: true,
        smilePhoto: true,
        digitalCopy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // console.log(certificates);

    return <CertificatesAdminList certificates={certificates as any} />;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return (
      <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">Произошла ошибка при загрузке сертификатов</p>
        </div>
    );
  }
}
