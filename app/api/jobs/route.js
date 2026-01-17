import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Job from "@/models/job.model"
import { ApiResponse } from "@/lib/utils/ApiResponse"
import { getToken } from "next-auth/jwt"

// GET /api/jobs - Get all jobs
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit

    const searchTerm = searchParams.get("search") || ""
    const jobType = searchParams.get("jobType") || ""
    const category = searchParams.get("category") || ""
    const degree = searchParams.get("degree") || ""
    const location = searchParams.get("location") || ""

    // Build query
    let query = {}

    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { company: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      }
    }

    if (jobType && jobType !== "All") {
      query.jobType = jobType
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (degree && degree !== "All") {
      query.degree = degree
    }

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" }
    }

    const jobs = await Job.find(query).skip(skip).limit(limit).sort({ postedDate: -1 })
    const totalJobs = await Job.countDocuments(query)

    return NextResponse.json(new ApiResponse(200, "Jobs fetched successfully", jobs, { totalJobs, page, limit }))
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}

// POST /api/jobs - Create a new job
export async function POST(request) {
  try {
    await connectDB()

    // Verify authentication
    const token = await getToken({ req: request })
    if (!token || token.role !== "admin") {
      return NextResponse.json(new ApiResponse(401, "Unauthorized", null), { status: 401 })
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
    } = data

    if (!title || !company || !description || !location || !jobType || !category || !applyLink || !batch || !degree) {
      return NextResponse.json(new ApiResponse(400, "All required fields must be provided", null), { status: 400 })
    }

    const job = await Job.create({
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
      postedBy: token.sub,
      postedDate: new Date(),
    })

    return NextResponse.json(new ApiResponse(201, "Job created successfully", job), { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
