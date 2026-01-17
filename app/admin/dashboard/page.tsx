"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Briefcase, Video, CheckCircle } from "lucide-react"
import { fetchJobs, fetchVideos } from "@/lib/api"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalVideos: 0,
    activeVideos: 0,
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentVideos, setRecentVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch jobs
        const jobsResponse = await fetchJobs({}, "", 1, 100)
        const jobs = jobsResponse.data || []

        // Fetch videos
        const videosResponse = await fetchVideos(1, 100)
        const videos = videosResponse.data || []

        // Calculate stats
        const activeJobs = jobs.filter((job) => job.isActive).length
        const activeVideos = videos.filter((video) => video.isActive).length

        setStats({
          totalJobs: jobs.length,
          activeJobs,
          totalVideos: videos.length,
          activeVideos,
        })

        // Get recent jobs and videos
        setRecentJobs(jobs.slice(0, 3))
        setRecentVideos(videos.slice(0, 3))

        setLoading(false)
      } catch (err) {
        console.error("Error loading dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome to the laddernest admin dashboard</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 animate-pulse">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-slate-200 mr-4 h-12 w-12"></div>
                <div>
                  <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Jobs Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Jobs</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalJobs}</h3>
              </div>
            </div>
          </div>

          {/* Active Jobs Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Active Jobs</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.activeJobs}</h3>
              </div>
            </div>
          </div>

          {/* Total Videos Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Videos</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.totalVideos}</h3>
              </div>
            </div>
          </div>

          {/* Active Videos Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Active Videos</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.activeVideos}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Jobs</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-md animate-pulse">
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-40 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-slate-800">{job.title}</h3>
                    <p className="text-sm text-slate-600">{job.company}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      job.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-4">No jobs available</p>
          )}
        </div>

        {/* Recent Videos */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Videos</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-md animate-pulse">
                  <div>
                    <div className="h-4 bg-slate-200 rounded w-40 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : recentVideos.length > 0 ? (
            <div className="space-y-4">
              {recentVideos.map((video) => (
                <div key={video._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-slate-800">{video.title}</h3>
                    <p className="text-sm text-slate-600">{video.category}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      video.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {video.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-4">No videos available</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
