# File Upload Testing Guide

This guide helps you test the `/api/upload` endpoint for uploading files to your S3 bucket.

## Prerequisites

1. **Environment Variables**: Make sure you have the following environment variables set up in your `.env.local` file:

```env
# S3 Configuration
S3_BUCKET_NAME=your-bucket-name
S3_REGION=us-east-1
S3_URL=https://s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Database
DATABASE_URL="file:./dev.db"

# Email Configuration (for OTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

2. **Next.js Server**: Start your development server:
```bash
npm run dev
```

3. **Authentication**: Make sure you're logged in to your app (the upload endpoint requires authentication).

## Testing Methods

### Method 1: Built-in Test Page (Recommended)

1. Navigate to `http://localhost:3000/test-upload` in your browser
2. Select a file using the file input
3. Click "Upload to S3"
4. Check the result for success/failure details

### Method 2: HTML Test Page

1. Open `test-upload.html` in your browser
2. Make sure you're logged in to your Next.js app in another tab
3. Select a file and click "Upload to S3"

### Method 3: Command Line Testing

#### Using the test script:
```bash
# Make the script executable (if not already)
chmod +x test-upload.sh

# Run the test
./test-upload.sh
```

#### Using curl directly:
```bash
# Create a test file
echo "Test content" > test-file.txt

# Upload with authentication (replace with your session cookie)
curl -X POST \
  -F "file=@test-file.txt" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_COOKIE" \
  "http://localhost:3000/api/upload" \
  -w "\nHTTP Status: %{http_code}\n"

# Clean up
rm test-file.txt
```

#### Using Node.js script:
```bash
# Install dependencies (if not already installed)
npm install node-fetch form-data

# Run the test script
node test-upload.js
```

## Expected Behavior

### Successful Upload
- **Status**: 200 OK
- **Response**:
```json
{
  "success": true,
  "url": "https://your-bucket.s3.amazonaws.com/1234567890-user-id.jpg?X-Amz-Algorithm=..."
}
```

### Failed Upload (Common Issues)

1. **Not Authenticated (401)**:
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

2. **No File Uploaded (400)**:
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

3. **S3 Upload Failed (500)**:
```json
{
  "success": false,
  "error": "Failed to upload file"
}
```

## Troubleshooting

### Authentication Issues
- Make sure you're logged in to your Next.js app
- Check that your session is valid
- Verify NextAuth configuration

### S3 Configuration Issues
- Verify all S3 environment variables are set correctly
- Check that your S3 credentials have the necessary permissions
- Ensure the S3 bucket exists and is accessible
- Verify the S3 region matches your bucket's region

### File Upload Issues
- Check file size limits (if any)
- Verify file type restrictions
- Ensure the file is not corrupted

### Server Issues
- Make sure the Next.js development server is running
- Check for any error messages in the server console
- Verify all dependencies are installed

## File Naming Convention

The uploaded files are named using this pattern:
```
{timestamp}-{user-id}{file-extension}
```

Example: `1733612909844-01939b29-63ca-7799-8afb-22ee7d4ff503.png`

## Security Notes

- The endpoint requires authentication
- Files are uploaded with user-specific naming
- S3 URLs are signed and expire after 1 hour
- File validation should be added for production use

## Next Steps

After successful testing, consider:
1. Adding file type validation
2. Implementing file size limits
3. Adding file metadata to database
4. Implementing file deletion functionality
5. Adding progress indicators for large files
