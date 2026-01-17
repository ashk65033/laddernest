"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface VideoFormProps {
  video?: any
  onSubmit: (videoData: any) => void
  onCancel: () => void
}

export function VideoForm({ video, onSubmit, onCancel }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    description: "",
    thumbnailUrl: "",
    category: "Interview Prep",
    isActive: true,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        videoUrl: video.videoUrl || "",
        description: video.description || "",
        thumbnailUrl: video.thumbnailUrl || "",
        category: video.category || "Interview Prep",
        isActive: video.isActive !== undefined ? video.isActive : true,
      })
    }
  }, [video])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.videoUrl.trim()) newErrors.videoUrl = "Video URL is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"

    // URL validation for videoUrl
    if (formData.videoUrl && !formData.videoUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      newErrors.videoUrl = "Please enter a valid URL (including http:// or https://)"
    }

    // URL validation for thumbnailUrl if provided
    if (formData.thumbnailUrl && !formData.thumbnailUrl.match(/^(http|https):\/\/[^ "]+$/)) {
      newErrors.thumbnailUrl = "Please enter a valid URL (including http:// or https://)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Video Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.title ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-slate-700 mb-1">
          Video URL (YouTube Embed URL)*
        </label>
        <input
          type="url"
          id="videoUrl"
          name="videoUrl"
          required
          value={formData.videoUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.videoUrl ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="https://www.youtube.com/embed/VIDEO_ID"
        />
        {errors.videoUrl && <p className="mt-1 text-xs text-red-600">{errors.videoUrl}</p>}
        <p className="mt-1 text-xs text-slate-500">Example: https://www.youtube.com/embed/VIDEO_ID</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          required
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.description ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        ></textarea>
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-slate-700 mb-1">
          Thumbnail URL (Optional)
        </label>
        <input
          type="url"
          id="thumbnailUrl"
          name="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.thumbnailUrl ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="https://example.com/thumbnail.jpg"
        />
        {errors.thumbnailUrl && <p className="mt-1 text-xs text-red-600">{errors.thumbnailUrl}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
          Category*
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Interview Prep">Interview Prep</option>
          <option value="Career Advice">Career Advice</option>
          <option value="Technical Skills">Technical Skills</option>
          <option value="Industry Insights">Industry Insights</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-slate-700">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : video ? (
            "Update Video"
          ) : (
            "Add Video"
          )}
        </button>
      </div>
    </form>
  )
}
