import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/job.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"
import mongoose from "mongoose"

// GET /api/jobs/[id] - Get a job by ID
export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(new ApiResponse(400, "Invalid job ID", null), { status: 400 })
    }

    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json(new ApiResponse(404, "Job not found", null), { status: 404 })
    }

    return NextResponse.json(new ApiResponse(200, "Job fetched successfully", job))
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// PUT /api/jobs/[id] - Update a job
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
      return NextResponse.json(new ApiResponse(400, "Invalid job ID", null), { status: 400 })
    }

    const data = await request.json()
    const {
      title,
      company,
      description,
      requirements,
      logoUrl,
      location,
      jobType,
      category,
      applyLink,
      batch,
      salary,
      degree,
      isFeatured,
      isActive,
    } = data

    if (!title || !company || !description || !location || !jobType || !category || !applyLink || !batch || !degree) {
      return NextResponse.json(new ApiResponse(400, "All required fields must be provided", null), { status: 400 })
    }

    const job = await Job.findById(id)

    if (!job) {
      return NextResponse.json(new ApiResponse(404, "Job not found", null), { status: 404 })
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        company,
        description,
        requirements,
        logoUrl,
        location,
        jobType,
        category,
        applyLink,
        batch,
        salary,
        degree,
        isFeatured,
        isActive,
      },
      { new: true },
    )

    return NextResponse.json(new ApiResponse(200, "Job updated successfully", updatedJob))
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Delete a job
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
      return NextResponse.json(new ApiResponse(400, "Invalid job ID", null), { status: 400 })
    }

    const job = await Job.findByIdAndDelete(id)

    if (!job) {
      return NextResponse.json(new ApiResponse(404, "Job not found", null), { status: 404 })
    }

    return NextResponse.json(new ApiResponse(200, "Job deleted successfully", null))
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
