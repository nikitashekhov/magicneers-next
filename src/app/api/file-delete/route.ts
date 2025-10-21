'use server';

import { NextRequest, NextResponse } from 'next/server';
import { removeFromS3, uploadToS3 } from '@/lib/aws'
import { auth } from '@/auth';
import { deleteFileFromDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const fileId = formData.get('fileId') as string;

  if (!fileId) {
    return NextResponse.json({ success: false, error: 'No fileId provided' }, { status: 400 });
  }

  const deletedFile = await deleteFileFromDB(fileId);

  if (!deletedFile) {
    return NextResponse.json({ success: false, error: 'Failed to delete file record' }, { status: 500 });
  }

  const result = await removeFromS3(deletedFile.link);
  return NextResponse.json({ success: true, result });
}


// export async function GET(request: NextRequest) {
//   const toDelete = ['1733612909844-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733613094510-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733613367883-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733613423716-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733613514339-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733613597270-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733614321513-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733614327078-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733614384144-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733614681915-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733657720585-01939b29-63ca-7799-8afb-22ee7d4ff503.svg','1733658241062-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733658826680-01939b29-63ca-7799-8afb-22ee7d4ff503.svg','1733664619023-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733690677754-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733690778567-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733694060940-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733728722317-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733728722464-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733728722731-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733728722798-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733388648-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389618-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389691-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389835-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389867-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389869-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733389960-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390000-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390024-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390045-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390109-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390331-01939b29-63ca-7799-8afb-22ee7d4ff503.jpeg','1733733390363-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390685-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390738-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733733390865-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733749857969-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733750102712-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733750335378-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733750402617-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733750573389-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733760086587-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733760684055-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733760926146-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733761061241-01939b29-63ca-7799-8afb-22ee7d4ff503.jpg','1733761676208-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733761676216-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733761676227-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733761676231-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733780216967-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733780552428-01939b29-63ca-7799-8afb-22ee7d4ff503.png','1733844227390-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733844227456-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG','1733844227459-01939b29-63ca-7799-8afb-22ee7d4ff503.PNG']
  
//   const deleteFile = async (filename: string) => {
//     const updatedFile = await deleteFileByLink(`https://keek.storage.yandexcloud.net/${filename}`)
//     const operation = await removeFromS3(filename)
//     return {updatedFile, operation}
//   }
  
//   const statuses = await Promise.all(toDelete.map(async (filename) => {
//       return await deleteFile(filename)
//   }))
//   return NextResponse.json({ statuses });
// }