import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound, forbidden } from 'next/navigation';
import EditCertificateForm from '@/components/edit-certificate-form';

interface EditCertificatePageProps {
  params: {
    id: string;
  };
}

export default async function EditCertificatePage({ params }: EditCertificatePageProps) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect('/auth/signin');
  }

  if ((session.user as { role?: string }).role !== 'admin') {
    forbidden();
  }

  try {
    const { id } = await params;
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: true,
        smilePhoto: true,
        digitalCopy: true
      }
    });

    if (!certificate) {
      notFound();
    }

    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Редактирование сертификата
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Измените данные сертификата и нажмите &quot;Сохранить&quot; для применения изменений
          </p>
        </div>
        
        <div className="p-6">
          <EditCertificateForm certificate={certificate as any} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">Произошла ошибка при загрузке сертификата</p>
          <a
            href="/certificates"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Вернуться к списку сертификатов
          </a>
        </div>
      </div>
    );
  }
}
