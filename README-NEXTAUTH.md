# NextAuth.js OTP Authentication Setup

This project now includes NextAuth.js with custom OTP (One-Time Password) authentication using email. Users can sign in by entering their email address and receiving a 6-digit code via email.

## Features

- ✅ NextAuth.js v5 (Auth.js) integration
- ✅ Custom OTP email authentication
- ✅ Prisma database adapter with SQLite
- ✅ Nodemailer for email sending
- ✅ TypeScript support
- ✅ Modern UI with Tailwind CSS
- ✅ Session management
- ✅ Protected routes

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Database
DATABASE_URL="file:./dev.db"

# Email Configuration (SMTP)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### 2. Email Configuration

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `EMAIL_SERVER_PASSWORD`

For other email providers, adjust the SMTP settings accordingly.

### 3. Database Setup

The database is already set up with SQLite. If you need to reset it:

```bash
npx prisma db push
```

### 4. Running the Application

```bash
npm run dev
```

## Authentication Flow

1. User visits `/auth/signin`
2. User enters their email address
3. System generates a 6-digit OTP and sends it via email
4. User enters the OTP code
5. System verifies the OTP and creates a session
6. User is redirected to the dashboard

## File Structure

```
src/
├── auth.ts                           # NextAuth configuration
├── lib/
│   └── otp-verification.ts          # OTP generation and verification
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts         # NextAuth API routes
│   │       └── verify-otp/
│   │           └── route.ts         # Custom OTP verification
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx             # Sign-in page
│   │   └── verify-request/
│   │       └── page.tsx             # Email sent confirmation
│   ├── dashboard/
│   │   └── page.tsx                 # Protected dashboard
│   ├── layout.tsx                   # Root layout with SessionProvider
│   └── page.tsx                     # Home page with auth links
└── prisma/
    └── schema.prisma                # Database schema
```

## Customization

### Email Template

The email template can be customized in `src/auth.ts` in the `sendVerificationRequest` function.

### OTP Expiration

OTP codes expire after 10 minutes by default. This can be changed in:
- `src/auth.ts` (maxAge)
- `src/lib/otp-verification.ts` (expiration time)

### Database

To use a different database, update the `DATABASE_URL` in `.env.local` and run:
```bash
npx prisma db push
```

## Security Notes

- Always use a strong `NEXTAUTH_SECRET` in production
- Use environment variables for all sensitive data
- Consider rate limiting for OTP requests
- Implement proper email validation
- Use HTTPS in production

## Testing

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign In with OTP"
4. Enter a valid email address
5. Check your email for the 6-digit code
6. Enter the code to complete authentication

## Troubleshooting

### Email Not Sending
- Check SMTP credentials
- Verify email provider settings
- Check spam folder
- Ensure proper environment variables

### Database Issues
- Run `npx prisma generate`
- Run `npx prisma db push`
- Check `DATABASE_URL` in `.env.local`

### Authentication Errors
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure all required environment variables are set
