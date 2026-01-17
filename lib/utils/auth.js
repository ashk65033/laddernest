import { getToken } from "next-auth/jwt"
import { ApiError } from "./ApiError.js"

export const verifyJWT = async (req, res, next) => {
  try {
    const token = await getToken({ req })

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    req.user = {
      _id: token.sub,
      email: token.email,
      username: token.name,
      role: token.role,
    }

    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
}

export const requireAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Forbidden: Admin access required")
    }
    next()
  } catch (error) {
    throw new ApiError(403, error?.message || "Forbidden: Admin access required")
  }
}
