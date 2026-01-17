// API route to seed admin user on production
// Protected by ADMIN_SECRET to prevent unauthorized access
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import User from '@/models/user.model'

export async function POST(request) {
    try {
        // Check for ADMIN_SECRET in header
        const authHeader = request.headers.get('x-admin-secret')
        if (!authHeader || authHeader !== process.env.ADMIN_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            return NextResponse.json(
                { error: 'ADMIN_EMAIL or ADMIN_PASSWORD not configured' },
                { status: 500 }
            )
        }

        await connectDB()

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail })
        if (existingAdmin) {
            return NextResponse.json({
                message: 'Admin user already exists',
                email: adminEmail
            })
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(adminPassword, 10)
        await User.create({
            username: 'admin',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
            fullName: 'System Admin'
        })

        return NextResponse.json({
            message: 'Admin user created successfully',
            email: adminEmail
        })
    } catch (error) {
        console.error('Seed error:', error)
        return NextResponse.json(
            { error: 'Failed to seed admin user' },
            { status: 500 }
        )
    }
}
