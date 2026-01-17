import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Video from "@/models/video.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"
import mongoose from "mongoose"

// GET /api/videos/[id] - Get a video by ID
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse(400, "Invalid video ID", null), { status: 400 })
    }

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json(new ApiResponse(404, "Video not found", null), { status: 404 })
    }

    return NextResponse.json(new ApiResponse(200, "Video fetched successfully", video))
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// PUT /api/videos/[id] - Update a video
export async function PUT(request, { params }) {
  try {
    await connectDB()

    // Verify authentication
    const token = await getToken({ req: request })
    if (!token || token.role !== "admin") {
      return NextResponse.json(new ApiResponse(401, "Unauthorized", null), { status: 401 })
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse(400, "Invalid video ID", null), { status: 400 })
    }

    const data = await request.json()
    const { title, videoUrl, description, thumbnailUrl, category, isActive } = data

    if (!title || !videoUrl || !description || !category) {
      return NextResponse.json(new ApiResponse(400, "All required fields must be provided", null), { status: 400 })
    }

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json(new ApiResponse(404, "Video not found", null), { status: 404 })
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      {
        title,
        videoUrl,
        description,
        thumbnailUrl,
        category,
        isActive: isActive !== undefined ? isActive : video.isActive,
      },
      { new: true },
    )

    return NextResponse.json(new ApiResponse(200, "Video updated successfully", updatedVideo))
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// DELETE /api/videos/[id] - Delete a video
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    // Verify authentication
    const token = await getToken({ req: request })
    if (!token || token.role !== "admin") {
      return NextResponse.json(new ApiResponse(401, "Unauthorized", null), { status: 401 })
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse(400, "Invalid video ID", null), { status: 400 })
    }

    const video = await Video.findByIdAndDelete(id)

    if (!video) {
      return NextResponse.json(new ApiResponse(404, "Video not found", null), { status: 404 })
    }

    return NextResponse.json(new ApiResponse(200, "Video deleted successfully", null))
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
