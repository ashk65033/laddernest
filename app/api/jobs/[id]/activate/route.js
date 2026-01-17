import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/job.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"
import mongoose from "mongoose"

// POST /api/jobs/[id]/activate - Toggle job active status
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
      return NextResponse.json(new ApiResponse(400, "Invalid job ID", null), { status: 400 })
    }

    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json(new ApiResponse(404, "Job not found", null), { status: 404 })
    }

    job.isActive = !job.isActive
    await job.save()

    return NextResponse.json(
      new ApiResponse(200, `Job ${job.isActive ? "activated" : "deactivated"} successfully`, job),
    )
  } catch (error) {
    console.error("Error toggling job status:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
