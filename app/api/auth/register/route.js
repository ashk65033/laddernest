import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/user.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()

    const data = await request.json()
    const { username, email, password, fullName, degree, graduationYear, secret } = data

    if (!process.env.ADMIN_SECRET) {
      console.error("ADMIN_SECRET is not defined in environment variables")
      return NextResponse.json(new ApiResponse(500, "Server misconfiguration", null), { status: 500 })
    }

    // Verify admin secret for registration
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(new ApiResponse(403, "Forbidden: Invalid secret", null), { status: 403 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(new ApiResponse(400, "Email or username already in use", null), { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      degree,
      graduationYear,
      isAdmin: true, // Since we're using admin secret, this is an admin user
    })

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      isAdmin: newUser.isAdmin,
    }

    return NextResponse.json(new ApiResponse(201, "User registered successfully", userResponse), { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
