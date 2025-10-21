import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/aws';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const certificateId = formData.get('certificateId') as string;
    
    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
    }

    // Проверяем существование сертификата
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        smilePhoto: true,
        digitalCopy: true
      }
    });

    if (!existingCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Получаем данные пользователя
    const userFirstName = formData.get('userFirstName') as string;
    const userLastName = formData.get('userLastName') as string;
    const userEmail = formData.get('userEmail') as string;

    // Подготавливаем данные для обновления
    const updateData: Record<string, unknown> = {
      title: formData.get('title') as string,
      installationDate: new Date(formData.get('installationDate') as string),
      doctorFirstName: formData.get('doctorFirstName') as string,
      doctorLastName: formData.get('doctorLastName') as string,
      clinicName: formData.get('clinicName') as string,
      clinicCity: formData.get('clinicCity') as string,
      technicianFirstName: formData.get('technicianFirstName') as string,
      technicianLastName: formData.get('technicianLastName') as string,
      materialType: formData.get('materialType') as string,
      materialColor: formData.get('materialColor') as string,
      fixationType: formData.get('fixationType') as string,
      fixationColor: formData.get('fixationColor') as string,
      dentalFormula: JSON.parse(formData.get('dentalFormula') as string),
    };

    // Обрабатываем загрузку новых файлов
    const smilePhotoFile = formData.get('smilePhoto') as File;
    const digitalCopyFile = formData.get('digitalCopy') as File;

    let smilePhotoId = existingCertificate.smilePhotoId;
    let digitalCopyId = existingCertificate.digitalCopyId;

    // Если загружено новое фото улыбки
    if (smilePhotoFile && smilePhotoFile.size > 0) {
      const smilePhotoBuffer = Buffer.from(await smilePhotoFile.arrayBuffer());
      const smilePhotoResult = await uploadToS3(smilePhotoBuffer, `certificates/smile-photos/${Date.now()}-${smilePhotoFile.name}`);
      
      // Создаем новую запись файла
      const newSmilePhoto = await prisma.file.create({
        data: {
          name: smilePhotoFile.name,
          type: smilePhotoFile.type,
          size: smilePhotoFile.size.toString(),
          link: smilePhotoResult.url?.split('?')[0] || '',
        }
      });
      
      smilePhotoId = newSmilePhoto.id;
    }

    // Если загружена новая цифровая копия
    if (digitalCopyFile && digitalCopyFile.size > 0) {
      const digitalCopyBuffer = Buffer.from(await digitalCopyFile.arrayBuffer());
      const digitalCopyResult = await uploadToS3(digitalCopyBuffer, `certificates/digital-copies/${Date.now()}-${digitalCopyFile.name}`);
      
      // Создаем новую запись файла
      const newDigitalCopy = await prisma.file.create({
        data: {
          name: digitalCopyFile.name,
          type: digitalCopyFile.type,
          size: digitalCopyFile.size.toString(),
          link: digitalCopyResult.url?.split('?')[0] || '',
        }
      });
      
      digitalCopyId = newDigitalCopy.id;
    }

    // Обрабатываем пользователя, если данные предоставлены
    let userId = existingCertificate.userId;
    if (userFirstName && userLastName && userEmail) {
      try {
        // Сначала пытаемся найти пользователя по email
        let user = await prisma.user.findUnique({
          where: { email: userEmail }
        });

        if (!user) {
          // Если пользователь не найден, создаем нового
          user = await prisma.user.create({
            data: {
              email: userEmail,
              firstName: userFirstName,
              lastName: userLastName,
              name: `${userFirstName} ${userLastName}`,
              role: 'user'
            }
          });
        } else {
          // Если пользователь найден, обновляем его данные
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              firstName: userFirstName,
              lastName: userLastName,
              name: `${userFirstName} ${userLastName}`
            }
          });
        }
        userId = user.id;
      } catch (error) {
        console.error('Error handling user:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to create or update user' 
        }, { status: 500 });
      }
    }

    // Обновляем сертификат
    const updatedCertificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        ...updateData,
        userId,
        smilePhotoId,
        digitalCopyId,
      },
      include: {
        user: true,
        smilePhoto: true,
        digitalCopy: true
      }
    });

    return NextResponse.json({
      success: true,
      certificate: updatedCertificate
    });

  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
