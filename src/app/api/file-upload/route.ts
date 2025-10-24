'use server';

import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/aws'
import { auth } from '@/auth';
import path from 'node:path';
import { insertFileInDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string | null;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const originalFileName = file.name;
  const fileExtension = path.extname(originalFileName);
  const fileName = `${session?.user.id}${fileExtension}`;
  const fileSize = file.size;

  // save file in s3
  const s3FileName = `${folder ? `${folder}/` : ''}${Date.now()}-${fileName}`;
  const result = await uploadToS3(fileBuffer, s3FileName);
  if (!result.success || !result.url) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  // save file in db
  const createdFile = await insertFileInDB({
    name: s3FileName,
    type: fileExtension,
    size: fileSize,
    link: result.url.split('?')[0] || '',
  });

  return NextResponse.json({ success: true, fileId: createdFile.id });
}