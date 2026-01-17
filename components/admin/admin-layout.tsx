// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import Link from "next/link"
// import { LayoutDashboard, Briefcase, Video, LogOut } from "lucide-react"
// import { useSession, signOut } from "next-auth/react"

// interface AdminLayoutProps {
//   children: React.ReactNode
// }

// export function AdminLayout({ children }: AdminLayoutProps) {
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()
//   const pathname = usePathname()
//   const { data: session, status } = useSession()

//   useEffect(() => {
//     if (status === "loading") {
//       return
//     }

//     if (status === "unauthenticated") {
//       router.push("/admin/login")
//       return
//     }

//     if (session?.user?.role !== "admin") {
//       router.push("/admin/login")
//       return
//     }

//     setIsLoading(false)
//   }, [session, status, router])

//   const handleLogout = async () => {
//     await signOut({ redirect: false })
//     router.push("/admin/login")
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Admin Header */}
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">laddernest Admin</h1>
//           <button onClick={handleLogout} className="flex items-center text-slate-600 hover:text-blue-600">
//             <LogOut className="h-5 w-5 mr-1" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </header>

//       {/* Admin Navigation */}
//       <div className="container mx-auto px-4 py-4">
//         <nav className="flex space-x-1 mb-6 border-b border-slate-200 pb-2">
//           <Link
//             href="/admin/dashboard"
//             className={`px-4 py-2 rounded-md flex items-center ${
//               pathname === "/admin/dashboard" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             <LayoutDashboard className="h-5 w-5 mr-2" />
//             <span>Dashboard</span>
//           </Link>
//           <Link
//             href="/admin/jobs"
//             className={`px-4 py-2 rounded-md flex items-center ${
//               pathname === "/admin/jobs" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             <Briefcase className="h-5 w-5 mr-2" />
//             <span>Jobs</span>
//           </Link>
//           <Link
//             href="/admin/videos"
//             className={`px-4 py-2 rounded-md flex items-center ${
//               pathname === "/admin/videos" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             <Video className="h-5 w-5 mr-2" />
//             <span>Videos</span>
//           </Link>
//         </nav>

//         {/* Main Content */}
//         <main>{children}</main>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Briefcase, Video, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { SimpleSessionProvider } from "../session-provider"

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "unauthenticated") {
      router.push("/admin/login")
      return
    }

    if (session?.user?.role !== "admin") {
      router.push("/admin/login")
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">laddernest Admin</h1>
          <button onClick={handleLogout} className="flex items-center text-slate-600 hover:text-blue-600">
            <LogOut className="h-5 w-5 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex space-x-1 mb-6 border-b border-slate-200 pb-2">
          <Link
            href="/admin/dashboard"
            className={`px-4 py-2 rounded-md flex items-center ${
              pathname === "/admin/dashboard" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/jobs"
            className={`px-4 py-2 rounded-md flex items-center ${
              pathname === "/admin/jobs" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="h-5 w-5 mr-2" />
            <span>Jobs</span>
          </Link>
          <Link
            href="/admin/videos"
            className={`px-4 py-2 rounded-md flex items-center ${
              pathname === "/admin/videos" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Video className="h-5 w-5 mr-2" />
            <span>Videos</span>
          </Link>
        </nav>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SimpleSessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SimpleSessionProvider>
  )
}