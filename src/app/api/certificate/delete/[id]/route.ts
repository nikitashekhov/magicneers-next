'use server';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { removeFromS3 } from '@/lib/aws';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  if ((session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { id: certificateId } = await params;

    if (!certificateId) {
      return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 });
    }

    // Находим сертификат с файлами
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        smilePhoto: true,
        digitalCopy: true
      }
    });

    if (!certificate) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    // Извлекаем ключи S3 из URL файлов
    // URL может быть в формате: https://bucket.s3.region.amazonaws.com/certificates/file.jpg
    // или https://endpoint.com/certificates/file.jpg
    // Нужно извлечь путь после домена
    const extractS3Key = (url: string, fileName: string): string => {
      try {
        const urlObj = new URL(url);
        // Убираем начальный слеш из pathname
        return urlObj.pathname.substring(1);
      } catch {
        // Если не удалось распарсить URL, используем имя файла с путем certificates/
        // Это fallback для старых записей
        return `certificates/${fileName}`;
      }
    };

    // Сохраняем информацию о файлах перед удалением сертификата
    const smilePhotoKey = extractS3Key(certificate.smilePhoto.link, certificate.smilePhoto.name);
    const digitalCopyKey = extractS3Key(certificate.digitalCopy.link, certificate.digitalCopy.name);
    const smilePhotoId = certificate.smilePhotoId;
    const digitalCopyId = certificate.digitalCopyId;

    // Сначала удаляем сертификат из БД (это разорвет связи с файлами)
    await prisma.certificate.delete({
      where: { id: certificateId }
    });

    // Теперь можно удалить записи файлов из БД
    await Promise.all([
      prisma.file.delete({ where: { id: smilePhotoId } }).catch((error) => {
        console.error('Error deleting smile photo from DB:', error);
      }),
      prisma.file.delete({ where: { id: digitalCopyId } }).catch((error) => {
        console.error('Error deleting digital copy from DB:', error);
      })
    ]);

    // Удаляем файлы из S3 (не критично, если не удалось - продолжаем)
    await Promise.allSettled([
      removeFromS3(smilePhotoKey),
      removeFromS3(digitalCopyKey)
    ]);

    revalidatePath('/certificates');
    revalidatePath('/');

    return NextResponse.json({ 
      success: true,
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

