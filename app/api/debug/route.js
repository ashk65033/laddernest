// Debug API route to check environment variables
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    adminEmail: process.env.ADMIN_EMAIL,
    adminPasswordExists: !!process.env.ADMIN_PASSWORD,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    // Don't return actual password for security
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length
  })
}
