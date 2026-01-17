"use client"

import { Calendar, MapPin, Briefcase, DollarSign, Award, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface JobProps {
  _id: string
  title: string
  company: string
  location: string
  jobType: string
  category: string
  applyLink: string
  batch: string
  salary: string
  degree: string
  isFeatured: boolean
  isActive: boolean
  logoUrl: string
  postedDate: string
  description?: string
}

export function JobCard({ job }: { job: JobProps }) {
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(job.postedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Calculate days ago
  const daysAgo = Math.floor((new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 3600 * 24))
  const timeAgo = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-md transform translate-y-[-4px]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {job.isFeatured && (
        <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 text-center">Featured</div>
      )}
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="mr-4 flex-shrink-0">
            <Image
              src={job.logoUrl || "/placeholder.svg?height=50&width=50"}
              alt={`${job.company} logo`}
              width={50}
              height={50}
              className="rounded-md border border-slate-200"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600">{job.title}</h3>
            <p className="text-slate-600 font-medium">{job.company}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-slate-600">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">{job.jobType}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Award className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">{job.degree}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
            <span className="text-sm">
              <span className="hidden md:inline">Posted: {formattedDate}</span>
              <span className="md:hidden">{timeAgo}</span>
            </span>
          </div>
        </div>

        {job.description && (
          <div className="mb-4">
            <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {job.category}
          </span>
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
              isHovered ? "animate-pulse" : ""
            }`}
          >
            Apply Now
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
