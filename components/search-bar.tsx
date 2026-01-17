"use client"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SearchBarProps {
  onSearch: (term: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // Debounce search to avoid too many updates
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(searchTerm)
      }}
      className="w-full max-w-md"
    >
      <div className={`relative flex items-center transition-all duration-200 ${isFocused ? "ring-2 ring-blue-500 rounded-lg shadow-lg" : "shadow-md"}`}>
        <input
          type="text"
          placeholder="Search jobs by title, company..."
          className="w-full px-4 py-2.5 pl-10 pr-24 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-transparent transition-all duration-200 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search
            className={`h-4 w-4 ${isFocused ? "text-blue-500" : "text-slate-400"} transition-colors duration-200`}
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-16 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none transition-all duration-200 text-sm font-medium"
        >
          Search
        </button>
      </div>

      {searchTerm && (
        <div className="mt-1 text-xs text-slate-500">
          Searching for: <span className="font-medium">{searchTerm}</span>
        </div>
      )}
    </form>
  )
}
