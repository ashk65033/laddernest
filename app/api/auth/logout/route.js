import { NextResponse } from "next/server"
import { ApiResponse } from "@/lib/utils/ApiResponse"

export async function POST() {
  try {
    // Clear cookies
    const response = NextResponse.json(new ApiResponse(200, "Logged out successfully", null))

    // Clear the cookies
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("next-auth.csrf-token")
    response.cookies.delete("next-auth.callback-url")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json(new ApiResponse(500, "Internal Server Error", null), { status: 500 })
  }
}
