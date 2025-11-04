
import CertificateCardPublic from '@/components/certificate-card-public';
import { prisma } from '@/lib/prisma';
import { Certificate } from '@/types/index';

export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) {

  const certificate = await prisma.certificate.findUnique({
    where: {
      id: (await params).id,
    },
    include: {
      smilePhoto: true,
      digitalCopy: true,
    }
  });


  return (
    <div className="mx-auto w-full md:w-1/2">
      {!certificate ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Сертификат не найден
          </h3>
          <p className="text-gray-500">
            Сертификат не найден
          </p>
        </div>
      ) : (
        <CertificateCardPublic certificate={certificate as unknown as Certificate} />
      )}
    </div>
  );
}
