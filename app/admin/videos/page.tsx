"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { VideoForm } from "@/components/admin/video-form"
import { Edit, Trash2, CheckCircle, XCircle, Plus } from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { fetchVideos, deleteVideo, toggleVideoStatus } from "@/lib/api"

export default function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const response = await fetchVideos(1, 100)
      setVideos(response.data || [])
      setLoading(false)
    } catch (err) {
      console.error("Error loading videos:", err)
      setError("Failed to load videos. Please try again.")
      setLoading(false)
    }
  }

  const handleAddVideo = () => {
    setCurrentVideo(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEditVideo = (video) => {
    setCurrentVideo(video)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDeleteVideo = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id)
        setVideos(videos.filter((video) => video._id !== id))
        showToast("Video deleted successfully", "success")
      } catch (err) {
        console.error("Error deleting video:", err)
        showToast("Failed to delete video", "error")
      }
    }
  }

  const handleToggleActive = async (id) => {
    try {
      await toggleVideoStatus(id)
      setVideos(videos.map((video) => (video._id === id ? { ...video, isActive: !video.isActive } : video)))
      showToast("Video status updated successfully", "success")
    } catch (err) {
      console.error("Error toggling video status:", err)
      showToast("Failed to update video status", "error")
    }
  }

  const handleFormSubmit = async (videoData) => {
    try {
      if (isEditing) {
        const response = await fetch(`/api/videos/${currentVideo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to update video")
        }

        setVideos(videos.map((video) => (video._id === currentVideo._id ? data.data : video)))
        showToast("Video updated successfully", "success")
      } else {
        const response = await fetch("/api/videos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(videoData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to create video")
        }

        setVideos([...videos, data.data])
        showToast("Video added successfully", "success")
      }
      setIsFormOpen(false)
    } catch (err) {
      console.error("Error submitting video:", err)
      showToast(err.message || "Failed to save video", "error")
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Manage Videos</h1>
          <p className="text-slate-600">Add, edit, and manage video resources</p>
        </div>
        <button
          onClick={handleAddVideo}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Video
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-slate-600">No videos found. Add your first video resource!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{video.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      video.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {video.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{video.description}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {video.category}
                  </span>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditVideo(video)} className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteVideo(video._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(video._id)}
                      className={`${
                        video.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      {video.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">{isEditing ? "Edit Video" : "Add New Video"}</h2>
                <button onClick={handleFormClose} className="text-slate-500 hover:text-slate-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <VideoForm video={currentVideo} onSubmit={handleFormSubmit} onCancel={handleFormClose} />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}
