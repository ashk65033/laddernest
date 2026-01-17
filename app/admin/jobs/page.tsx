"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { JobForm } from "@/components/admin/job-form"
import { Edit, Trash2, CheckCircle, XCircle, Plus } from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { fetchJobs, deleteJob, toggleJobStatus } from "@/lib/api"

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentJob, setCurrentJob] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await fetchJobs({}, "", 1, 100)
      setJobs(response.data || [])
      setLoading(false)
    } catch (err) {
      console.error("Error loading jobs:", err)
      setError("Failed to load jobs. Please try again.")
      setLoading(false)
    }
  }

  const handleAddJob = () => {
    setCurrentJob(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEditJob = (job) => {
    setCurrentJob(job)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id)
        setJobs(jobs.filter((job) => job._id !== id))
        showToast("Job deleted successfully", "success")
      } catch (err) {
        console.error("Error deleting job:", err)
        showToast("Failed to delete job", "error")
      }
    }
  }

  const handleToggleActive = async (id) => {
    try {
      const response = await toggleJobStatus(id)
      setJobs(jobs.map((job) => (job._id === id ? { ...job, isActive: !job.isActive } : job)))
      showToast("Job status updated successfully", "success")
    } catch (err) {
      console.error("Error toggling job status:", err)
      showToast("Failed to update job status", "error")
    }
  }

  const handleFormSubmit = async (jobData) => {
    try {
      if (isEditing) {
        const response = await fetch(`/api/jobs/${currentJob._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to update job")
        }

        setJobs(jobs.map((job) => (job._id === currentJob._id ? data.data : job)))
        showToast("Job updated successfully", "success")
      } else {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to create job")
        }

        setJobs([...jobs, data.data])
        showToast("Job added successfully", "success")
      }
      setIsFormOpen(false)
    } catch (err) {
      console.error("Error submitting job:", err)
      showToast(err.message || "Failed to save job", "error")
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
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Manage Jobs</h1>
          <p className="text-slate-600">Add, edit, and manage job listings</p>
        </div>
        <button
          onClick={handleAddJob}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-1" />
          Add Job
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {/* Job Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No jobs found. Add your first job listing!</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Job
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md"
                            src={job.logoUrl || "/placeholder.svg?height=50&width=50"}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{job.title}</div>
                          <div className="text-sm text-slate-500">{job.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.jobType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditJob(job)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(job._id)}
                          className={`${
                            job.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {job.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">{isEditing ? "Edit Job" : "Add New Job"}</h2>
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
              <JobForm job={currentJob} onSubmit={handleFormSubmit} onCancel={handleFormClose} />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </AdminLayout>
  )
}
