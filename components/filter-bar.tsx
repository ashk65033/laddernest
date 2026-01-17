"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Check, X } from "lucide-react"

const jobTypes = ["All", "Full Time", "Internship", "Remote", "Apprentice"]
const categories = ["All", "OffCampus", "WorkFromHome", "Internship"]
const degrees = ["All", "Any", "Bachelor's", "Master's", "PhD"]
const locations = [
  "All",
  "Remote",
  "San Francisco, CA",
  "New York, NY",
  "Boston, MA",
  "Seattle, WA",
  "Chicago, IL",
  "Austin, TX",
  "Miami, FL",
]

interface FilterBarProps {
  onFilterChange: (filters: any) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState({
    jobType: "All",
    category: "All",
    degree: "All",
    location: "All",
  })

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Remove the useEffect that's causing the infinite loop
  const handleFilterUpdate = (filterType: string, value: string) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
    setActiveDropdown(null) // Close dropdown after selection
  }

  const handleFilterChange = (filterType: string, value: string) => {
    handleFilterUpdate(filterType, value)
  }

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const renderDropdown = (type: string, options: string[], current: string) => {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(type)}
          className="w-full flex justify-between items-center p-2 border border-slate-300 rounded-md bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <span className="flex items-center">
            <span className="text-sm font-medium">{type}:</span>
            <span className="ml-2 text-sm text-blue-600">{current}</span>
          </span>
          {activeDropdown === type ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {activeDropdown === type && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleFilterChange(type.toLowerCase(), option)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center justify-between"
              >
                {option}
                {current === option && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800">Filters</h3>
        <button
          onClick={() => {
            const resetFilters = {
              jobType: "All",
              category: "All",
              degree: "All",
              location: "All",
            }
            setFilters(resetFilters)
            onFilterChange(resetFilters)
          }}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
        {renderDropdown("JobType", jobTypes, filters.jobType)}
        {renderDropdown("Category", categories, filters.category)}
        {renderDropdown("Degree", degrees, filters.degree)}
        {renderDropdown("Location", locations, filters.location)}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) =>
            value !== "All" ? (
              <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {value}
                <button
                  onClick={() => handleFilterUpdate(key, "All")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  )
}
