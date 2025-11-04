
import CertificateCardPublic from '@/components/certificate-card-public';
import { prisma } from '@/lib/prisma';
import { Certificate } from '@/types/index';

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
    <>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <CertificateCardPublic key={certificate.id} certificate={certificate as unknown as Certificate} />
            ))}
          </div>
        )}
    </>
  );
}
