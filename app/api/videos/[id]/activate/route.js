import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Video from "@/models/video.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"
import mongoose from "mongoose"

// POST /api/videos/[id]/activate - Toggle video active status
export async function POST(request, { params }) {
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

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json(new ApiResponse(404, "Video not found", null), { status: 404 })
    }

    video.isActive = !video.isActive
    await video.save()

    return NextResponse.json(
      new ApiResponse(200, `Video ${video.isActive ? "activated" : "deactivated"} successfully`, video),
    )
  } catch (error) {
    console.error("Error toggling video status:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
