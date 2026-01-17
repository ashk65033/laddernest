"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface JobFormProps {
  job?: any
  onSubmit: (jobData: any) => void
  onCancel: () => void
}

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    logoUrl: "",
    location: "",
    jobType: "Full Time",
    category: "OffCampus",
    applyLink: "",
    batch: "",
    salary: "",
    degree: "Bachelor's",
    isFeatured: false,
    isActive: true,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        description: job.description || "",
        requirements: job.requirements || "",
        logoUrl: job.logoUrl || "",
        location: job.location || "",
        jobType: job.jobType || "Full Time",
        category: job.category || "OffCampus",
        applyLink: job.applyLink || "",
        batch: job.batch || "",
        salary: job.salary || "",
        degree: job.degree || "Bachelor's",
        isFeatured: job.isFeatured || false,
        isActive: job.isActive !== undefined ? job.isActive : true,
      })
    }
  }, [job])

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
    if (!formData.company.trim()) newErrors.company = "Company is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.applyLink.trim()) newErrors.applyLink = "Apply link is required"
    if (!formData.batch.trim()) newErrors.batch = "Batch is required"
    if (!formData.salary.trim()) newErrors.salary = "Salary is required"

    // URL validation for applyLink
    if (formData.applyLink && !formData.applyLink.match(/^(http|https):\/\/[^ "]+$/)) {
      newErrors.applyLink = "Please enter a valid URL (including http:// or https://)"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Job Title*
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
          <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
            Company*
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.company ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
            Location*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.location ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
          <p className="mt-1 text-xs text-slate-500">Leave empty to use default placeholder</p>
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-slate-700 mb-1">
            Job Type*
          </label>
          <select
            id="jobType"
            name="jobType"
            required
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
            <option value="Apprentice">Apprentice</option>
            <option value="Remote">Remote</option>
          </select>
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
            <option value="OffCampus">OffCampus</option>
            <option value="WorkFromHome">WorkFromHome</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="applyLink" className="block text-sm font-medium text-slate-700 mb-1">
            Apply Link*
          </label>
          <input
            type="url"
            id="applyLink"
            name="applyLink"
            required
            value={formData.applyLink}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.applyLink ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://example.com/apply"
          />
          {errors.applyLink && <p className="mt-1 text-xs text-red-600">{errors.applyLink}</p>}
        </div>

        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-slate-700 mb-1">
            Batch*
          </label>
          <input
            type="text"
            id="batch"
            name="batch"
            required
            value={formData.batch}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.batch ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="2023"
          />
          {errors.batch && <p className="mt-1 text-xs text-red-600">{errors.batch}</p>}
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-1">
            Salary*
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            required
            value={formData.salary}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.salary ? "border-red-300 ring-1 ring-red-500" : "border-slate-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="$120,000"
          />
          {errors.salary && <p className="mt-1 text-xs text-red-600">{errors.salary}</p>}
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-slate-700 mb-1">
            Degree*
          </label>
          <select
            id="degree"
            name="degree"
            required
            value={formData.degree}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Any">Any</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
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
        <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-1">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={4}
          value={formData.requirements}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div className="flex space-x-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-sm text-slate-700">
            Featured Job
          </label>
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
          ) : job ? (
            "Update Job"
          ) : (
            "Add Job"
          )}
        </button>
      </div>
    </form>
  )
}
