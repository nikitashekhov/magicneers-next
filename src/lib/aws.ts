import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucket = process.env.S3_BUCKET_NAME!;
const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_URL!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadToS3(fileBuffer: Buffer, fileName: string) {
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: fileBuffer,
  });

  try {
    await s3Client.send(putObjectCommand);
    const url = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 });
    return { success: true, url: url };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function removeFromS3(fileName: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  try {
    await s3Client.send(deleteObjectCommand);
    return { success: true };
  } catch (error) {
    console.error('Error removing file:', error);
    return { success: false, error: 'Failed to remove file' };
  }
}