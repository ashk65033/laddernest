import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials")
            throw new Error("Email and password are required")
          }

          console.log("🔐 Login attempt:", {
            email: credentials.email,
            password: "***"
          })
          console.log("🔑 Expected admin credentials:", {
            email: process.env.ADMIN_EMAIL,
            password: "***"
          })

          await connectDB()

          // Regular user login (including admin if seeded in DB)
          console.log("🔍 Checking user login for:", credentials.email)
          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            console.log("❌ No user found with email:", credentials.email)
            throw new Error("No user found with this email")
          }

          console.log("👤 Found user:", user.username)
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.log("❌ Password validation failed")
            throw new Error("Invalid password")
          }

          console.log("✅ User authentication successful")
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.isAdmin ? "admin" : "user",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
