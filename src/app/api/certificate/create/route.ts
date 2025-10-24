'use server';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/aws';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.id || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    // Получаем файлы
    const smilePhotoFile = formData.get('smilePhoto') as File | null;
    const digitalCopyFile = formData.get('digitalCopy') as File | null;
    
    // Получаем данные сертификата
    const title = formData.get('title') as string;
    const installationDate = formData.get('installationDate') as string;
    const doctorFirstName = formData.get('doctorFirstName') as string;
    const doctorLastName = formData.get('doctorLastName') as string;
    const clinicName = formData.get('clinicName') as string;
    const clinicCity = formData.get('clinicCity') as string;
    const technicianFirstName = formData.get('technicianFirstName') as string;
    const technicianLastName = formData.get('technicianLastName') as string;
    const materialType = formData.get('materialType') as string;
    const materialColor = formData.get('materialColor') as string;
    const fixationType = formData.get('fixationType') as string;
    const fixationColor = formData.get('fixationColor') as string;
    const dentalFormula = formData.get('dentalFormula') as string;
    
    // Получаем данные пользователя
    const userFirstName = formData.get('userFirstName') as string;
    const userLastName = formData.get('userLastName') as string;
    const userEmail = formData.get('userEmail') as string;

    // Валидация обязательных полей
    if (!title || !installationDate || !smilePhotoFile || !digitalCopyFile || !userFirstName || !userLastName || !userEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title, installationDate, smilePhoto, digitalCopy, userFirstName, userLastName, userEmail' 
      }, { status: 400 });
    }

    // Загружаем фото улыбки в S3
    const smilePhotoBuffer = Buffer.from(await smilePhotoFile.arrayBuffer());
    const smilePhotoExtension = path.extname(smilePhotoFile.name);
    const smilePhotoFileName = `smile-${Date.now()}-${session.user.id}${smilePhotoExtension}`;
    const smilePhotoResult = await uploadToS3(smilePhotoBuffer, `certificates/${smilePhotoFileName}`);
    
    if (!smilePhotoResult.success || !smilePhotoResult.url) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload smile photo: ' + smilePhotoResult.error 
      }, { status: 500 });
    }

    // Загружаем цифровую копию в S3
    const digitalCopyBuffer = Buffer.from(await digitalCopyFile.arrayBuffer());
    const digitalCopyExtension = path.extname(digitalCopyFile.name);
    const digitalCopyFileName = `digital-${Date.now()}-${session.user.id}${digitalCopyExtension}`;
    const digitalCopyResult = await uploadToS3(digitalCopyBuffer, `certificates/${digitalCopyFileName}`);
    
    if (!digitalCopyResult.success || !digitalCopyResult.url) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to upload digital copy: ' + digitalCopyResult.error 
      }, { status: 500 });
    }

    // Создаем записи файлов в БД
    const smilePhotoFileRecord = await prisma.file.create({
      data: {
        name: smilePhotoFileName,
        type: smilePhotoExtension,
        size: smilePhotoFile.size.toString(),
        link: smilePhotoResult.url.split('?')[0] || ''
      }
    });

    const digitalCopyFileRecord = await prisma.file.create({
      data: {
        name: digitalCopyFileName,
        type: digitalCopyExtension,
        size: digitalCopyFile.size.toString(),
        link: digitalCopyResult.url.split('?')[0] || ''
      }
    });

    // Парсим зубную формулу из JSON
    let parsedDentalFormula;
    try {
      parsedDentalFormula = dentalFormula ? JSON.parse(dentalFormula) : {};
    } catch {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid dental formula JSON format' 
      }, { status: 400 });
    }

    // Находим или создаем пользователя
    let user;
    try {
      // Сначала пытаемся найти пользователя по email
      user = await prisma.user.findUnique({
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
    } catch (error) {
      console.error('Error handling user:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create or update user' 
      }, { status: 500 });
    }

    // Создаем сертификат
    const certificate = await prisma.certificate.create({
      data: {
        title,
        installationDate: new Date(installationDate),
        userId: user.id,
        smilePhotoId: smilePhotoFileRecord.id,
        digitalCopyId: digitalCopyFileRecord.id,
        doctorFirstName,
        doctorLastName,
        clinicName,
        clinicCity,
        technicianFirstName,
        technicianLastName,
        materialType,
        materialColor,
        fixationType,
        fixationColor,
        dentalFormula: parsedDentalFormula
      },
      include: {
        user: true,
        smilePhoto: true,
        digitalCopy: true
      }
    });

    revalidatePath('/');

    return NextResponse.json({ 
      success: true, 
      certificate 
    });

  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
