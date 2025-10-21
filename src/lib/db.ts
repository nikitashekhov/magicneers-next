import { prisma } from "./prisma";

interface FileData {
  name: string;
  type: string;
  size: number;
  link: string;
}

export async function insertFileInDB(fileData: FileData) {
  try {
    const file = await prisma.file.create({
      data: {
        name: fileData.name,
        type: fileData.type,
        size: fileData.size.toString(),
        link: fileData.link
      }
    });
    return file;
  } catch (error) {
    console.error('Error creating file record:', error);
    throw error;
  }
}

export async function deleteFileFromDB(fileId: string) {
  try {
    const file = await prisma.file.delete({
      where: { id: fileId }
    });
    return file;
  } catch (error) {
    console.error('Error deleting file record:', error);
    throw error;
  }
}