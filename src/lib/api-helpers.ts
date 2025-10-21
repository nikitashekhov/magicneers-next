export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/file-upload', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}