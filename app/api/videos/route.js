import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Video from "@/models/video.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"

// GET /api/videos - Get all videos
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit

    const videos = await Video.find({ isActive: true }).skip(skip).limit(limit).sort({ postedDate: -1 })
    const totalVideos = await Video.countDocuments({ isActive: true })

    return NextResponse.json(new ApiResponse(200, "Videos fetched successfully", videos, { totalVideos, page, limit }))
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// POST /api/videos - Create a new video
export async function POST(request) {
  try {
    await connectDB()

    // Verify authentication
    const token = await getToken({ req: request })
    if (!token || token.role !== "admin") {
      return NextResponse.json(new ApiResponse(401, "Unauthorized", null), { status: 401 })
    }

    const data = await request.json()
    const { title, videoUrl, description, thumbnailUrl, category } = data

    if (!title || !videoUrl || !description || !category) {
      return NextResponse.json(new ApiResponse(400, "All required fields must be provided", null), { status: 400 })
    }

    const video = await Video.create({
      title,
      videoUrl,
      description,
      thumbnailUrl,
      category,
      postedBy: token.name || "Admin",
      postedDate: new Date(),
    })

    return NextResponse.json(new ApiResponse(201, "Video created successfully", video), { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
