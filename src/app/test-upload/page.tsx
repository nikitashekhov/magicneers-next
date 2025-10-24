'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { forbidden } from 'next/navigation';

export default function TestUploadPage() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<{ status: number | string; data: unknown } | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [folder, setFolder] = useState<string>('foto');

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  // Check authentication and admin role in useEffect
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session || !session.user || !session.user.id || (session.user as { role?: string }).role !== 'admin') {
      forbidden();
    }
  }, [session, status]);

  // Handle loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setResult(null);
    setUploadProgress(0);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFolder = e.target.value;
    setFolder(selectedFolder);
    setResult(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      // Simulate progress for better UX
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
      });

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploadProgress(100);

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setResult({ 
        status: 'error', 
        data: { error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    } finally {
      setUploading(false);
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };


  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to test file uploads.</p>
          <a 
            href="/auth/signin" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 Upload Test Page</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">User Info</h2>
            <div className="bg-gray-100 p-3 rounded text-black">
              <p><strong>ID:</strong> {session?.user?.id}</p>
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>Name:</strong> {session?.user?.name}</p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Select a file to upload
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Select a folder to upload
            </label>
            <select
              id="folder"
              value={folder}
              onChange={(e) => handleFolderChange(e)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            >
              <option value="">Select a folder</option>
              <option value="foto">Photo</option>
              <option value="stl">STL-archive</option>
            </select>
          </div>

          {file && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">File Details</h3>
              <div className="bg-gray-100 p-3 rounded text-black">
                <p><strong>Name:</strong> {file.name}</p>
                <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> {file.type || 'Unknown'}</p>
                <p><strong>Last Modified:</strong> {new Date(file.lastModified).toLocaleString()}</p>
              </div>
            </div>
          )}

          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload to S3'}
          </button>

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Result</h3>
              <div className={`p-4 rounded ${
                result.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p><strong>Status:</strong> {result.status}</p>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Select a file using the file input above</li>
              <li>Click &quot;Upload to S3&quot; to test the endpoint</li>
              <li>Check the result below for success/failure details</li>
              <li>If successful, you&apos;ll get a signed S3 URL</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
