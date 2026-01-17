import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request) {
  const path = request.nextUrl.pathname

  // Define paths that are protected (require authentication)
  const isProtectedPath = path.startsWith("/admin") && !path.startsWith("/admin/login")

  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If the user is not authenticated or not an admin, redirect to login
    if (!token || token.role !== "admin") {
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ["/admin/:path*"],
}
