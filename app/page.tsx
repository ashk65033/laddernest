"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"
import { JobCard } from "@/components/job-card"
import { VideoSection } from "@/components/video-section"
import { Briefcase, Filter, Menu, X, ChevronDown, Users, Briefcase as BriefcaseIcon, TrendingUp, Target, Palette, Zap, Building, Star } from "lucide-react"
import { fetchJobs, fetchVideos } from "@/lib/api"
import Testimonial from "@/components/Testimonial"



function areJobsEqual(a: any[], b: any[]) {
  if (a === b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i]._id !== b[i]._id) return false
  }
  return true
}

export default function Home() {
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    jobType: "All",
    category: "All",
    degree: "All",
    location: "All",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalJobs, setTotalJobs] = useState(0)

  // Navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Track if initial load is done to prevent re-fetching
  const initialLoadDone = useRef(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load - only run once
  useEffect(() => {
    if (initialLoadDone.current) return

    const loadInitialData = async () => {
      try {
        setLoadingJobs(true)
        setLoadingVideos(true)
        setError(null)

        const jobsResponse = await fetchJobs()
        setJobs(jobsResponse.data || [])
        setTotalJobs(jobsResponse.meta?.totalJobs || 0)
        setLoadingJobs(false)

        const videosResponse = await fetchVideos()
        setVideos(videosResponse.data || [])
        setLoadingVideos(false)

        initialLoadDone.current = true
      } catch (err) {
        console.error("Error loading initial data:", err)
        setError("Failed to load data. Please try again later.")
        setLoadingJobs(false)
        setLoadingVideos(false)
      }
    }

    loadInitialData()
  }, []) // Empty dependency array

  // Memoized search handler to prevent recreation on every render
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setError(null) // Clear any previous errors

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoadingJobs(true)
        const response = await fetchJobs(filters, term)
        const newJobs = response.data || []

        // Only update if jobs actually changed
        setJobs(prevJobs => {
          if (areJobsEqual(prevJobs, newJobs)) {
            return prevJobs // Don't update state if same
          }
          return newJobs
        })

        setTotalJobs(response.meta?.totalJobs || 0)
        setLoadingJobs(false)
      } catch (err) {
        console.error("Error searching jobs:", err)
        setError("Failed to search jobs. Please try again.")
        setLoadingJobs(false)
      }
    }, 500)

  }, [filters]) // Only recreate if filters change

  // Memoized filter handler
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setError(null) // Clear any previous errors

    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(async () => {
      try {
        setLoadingJobs(true)
        const response = await fetchJobs(newFilters, searchTerm)
        const newJobs = response.data || []

        // Only update if jobs actually changed
        setJobs(prevJobs => {
          if (areJobsEqual(prevJobs, newJobs)) {
            return prevJobs // Don't update state if same
          }
          return newJobs
        })

        setTotalJobs(response.meta?.totalJobs || 0)
        setLoadingJobs(false)
      } catch (err) {
        console.error("Error filtering jobs:", err)
        setError("Failed to filter jobs. Please try again.")
        setLoadingJobs(false)
      }
    }, 500)

  }, [searchTerm]) // Only recreate if searchTerm changes

  // Memoized toggle function
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev)
  }, [])

  // Navigation handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
    setActiveDropdown(null)
  }, [])

  const toggleDropdown = useCallback((dropdown: string) => {
    setActiveDropdown(prev => prev === dropdown ? null : dropdown)
  }, [])

  // Handle service click to redirect to contact us
  const handleServiceClick = useCallback(() => {
    router.push('/contact-us')
  }, [router])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  // Memoized reset handler
  const handleReset = useCallback(async () => {
    setSearchTerm("")
    const resetFilters = {
      jobType: "All",
      category: "All",
      degree: "All",
      location: "All",
    }
    setFilters(resetFilters)
    setError(null)

    try {
      setLoadingJobs(true)
      const response = await fetchJobs(resetFilters, "")
      setJobs(response.data || [])
      setTotalJobs(response.meta?.totalJobs || 0)
      setLoadingJobs(false)
    } catch (err) {
      console.error("Error resetting filters:", err)
      setError("Failed to reset filters. Please try again.")
      setLoadingJobs(false)
    }
  }, [])

  // Memoize job grid with better optimization
  const jobsGrid = useMemo(() => {
    if (loadingJobs) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="flex items-start mb-4">
                <div className="mr-4 flex-shrink-0 bg-slate-200 h-12 w-12 rounded-md"></div>
                <div className="w-full">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={`skeleton-line-${i}`} className="h-4 bg-slate-200 rounded w-full"></div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (jobs.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )
    }

    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-slate-600 mb-4">No jobs match your search criteria.</p>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Reset Filters
        </button>
      </div>
    )
  }, [jobs, loadingJobs, handleReset])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }
    }
  }, [])

  // Services data
  const careerServices = [
    { icon: Users, title: "One-on-One Counseling", desc: "Personalized career guidance", color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, title: "Skill Upgrade Programs", desc: "Workshops & certifications", color: "from-green-500 to-emerald-500" },
    { icon: Target, title: "Interview Preparation", desc: "Mock interviews & feedback", color: "from-orange-500 to-red-500" },
    { icon: BriefcaseIcon, title: "Profile Building", desc: "Resume & CV optimization", color: "from-purple-500 to-pink-500" }
  ]

  const businessServices = [
    { icon: Palette, title: "Creative Design Solutions", desc: "Brand identity & logo design", color: "from-indigo-500 to-purple-500" },
    { icon: Zap, title: "Business Automation", desc: "Streamline your operations", color: "from-yellow-500 to-orange-500" },
    { icon: TrendingUp, title: "Growth Strategy", desc: "Scale your business effectively", color: "from-teal-500 to-blue-500" },
    { icon: Target, title: "Digital Marketing", desc: "SEO, content & social media", color: "from-rose-500 to-pink-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Gradient Background */}
      <header className="bg-gradient-to-r from-white via-blue-50 to-purple-50 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Main Navigation Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Animated Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
                laddernest
              </h1>
              <div className="ml-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Career Growth Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-slate-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-blue-200/50"
                  onMouseEnter={() => setActiveDropdown('career')}
                >
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Career Growth</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
                </button>

                {activeDropdown === 'career' && (
                  <div
                    className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 animate-in slide-in-from-top-2 duration-300"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white/95 border-l border-t border-white/20 rotate-45"></div>
                    <h3 className="font-bold text-slate-800 mb-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Career Growth & Job Market
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {careerServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={handleServiceClick}
                          className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/50 hover:shadow-lg"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color} shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                            <service.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 group-hover/item:text-blue-700 transition-colors">{service.title}</h4>
                            <p className="text-sm text-slate-600 group-hover/item:text-slate-700">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Business Solutions Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-slate-700 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all duration-300 py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-purple-200/50"
                  onMouseEnter={() => setActiveDropdown('business')}
                >
                  <BriefcaseIcon className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Business Solutions</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
                </button>

                {activeDropdown === 'business' && (
                  <div
                    className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 animate-in slide-in-from-top-2 duration-300"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white/95 border-l border-t border-white/20 rotate-45"></div>
                    <h3 className="font-bold text-slate-800 mb-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Brand & Business Solutions
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {businessServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={handleServiceClick}
                          className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200/50 hover:shadow-lg"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color} shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                            <service.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 group-hover/item:text-purple-700 transition-colors">{service.title}</h4>
                            <p className="text-sm text-slate-600 group-hover/item:text-slate-700">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <a
                href="/about-us"
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-700 font-medium px-4 transition-colors"
              >
                About Us
              </a>
              <a
                href="/contact-us"
                className="flex items-center space-x-2 text-slate-700 hover:text-purple-700 font-medium px-4 transition-colors"
              >
                Contact Us
              </a>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-3 text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu lg:hidden bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl border-t border-white/20 rounded-b-2xl shadow-2xl">
              <div className="py-6 space-y-2">
                {/* Career Growth Mobile */}
                <div className="mx-4">
                  <button
                    onClick={() => toggleDropdown('career')}
                    className="flex items-center justify-between w-full px-4 py-4 text-left text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">Career Growth</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeDropdown === 'career' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                  </button>

                  {activeDropdown === 'career' && (
                    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                      {careerServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={handleServiceClick}
                          className="flex items-start space-x-3 p-4 ml-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-200/50 cursor-pointer"
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${service.color} shadow-md`}>
                            <service.icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 text-sm">{service.title}</h4>
                            <p className="text-xs text-slate-600">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Business Solutions Mobile */}
                <div className="mx-4">
                  <button
                    onClick={() => toggleDropdown('business')}
                    className="flex items-center justify-between w-full px-4 py-4 text-left text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                        <BriefcaseIcon className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold">Business Solutions</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeDropdown === 'business' ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} />
                  </button>

                  {activeDropdown === 'business' && (
                    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                      {businessServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={handleServiceClick}
                          className="flex items-start space-x-3 p-4 ml-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200/50 cursor-pointer"
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${service.color} shadow-md`}>
                            <service.icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 text-sm">{service.title}</h4>
                            <p className="text-xs text-slate-600">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* About Us and Contact Us Links for Mobile */}
                <div className="mx-4 border-t border-slate-200/80 pt-4 mt-4 space-y-2">
                  <a
                    href="/about-us"
                    className="block px-4 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 font-semibold"
                  >
                    About Us
                  </a>
                  <a
                    href="/contact-us"
                    className="block px-4 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- Hero Section with Gradient Background --- */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm text-blue-200 font-medium">🚀 Your Career Journey Starts Here</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-in slide-in-from-bottom-3 duration-700">
            Your Dream Job
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Awaits
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom-3 duration-700 delay-100">
            Discover thousands of job listings from top companies and take the next step in your career journey with laddernest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-3 duration-700 delay-200">
            <a
              href="#job-listings"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30"
            >
              Start Your Search
            </a>
            <a
              href="/about-us"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
          <div className="mt-16 flex justify-center items-center gap-x-8 gap-y-4 flex-wrap text-white animate-in fade-in duration-700 delay-300">
            <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
              <Briefcase className="h-5 w-5 mr-2 text-blue-400" />
              <span className="font-medium">{totalJobs > 0 ? `${totalJobs.toLocaleString()}+` : '10,000+'} Live Jobs</span>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
              <Building className="h-5 w-5 mr-2 text-purple-400" />
              <span className="font-medium">1,200+ Companies</span>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-medium">Top Rated Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters Toggle (Mobile) */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-white to-blue-50 border border-blue-200/50 rounded-xl shadow-lg text-slate-700 hover:from-blue-50 hover:to-purple-50 hover:border-purple-200/50 transition-all duration-300 hover:shadow-xl"
          >
            <Filter className="h-5 w-5 mr-2 text-blue-600" />
            <span className="font-medium">{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Filters */}
        <section className={`mb-8 ${showFilters ? "block" : "hidden md:block"}`}>
          <FilterBar onFilterChange={handleFilterChange} />
        </section>

        {/* Job Listings */}
        <section id="job-listings" className="mb-12 scroll-mt-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              {loadingJobs ? "Loading Jobs..." : jobs.length > 0 ? "Latest Job Opportunities" : "No Jobs Found"}
            </h2>
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200/50 shadow-lg">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-semibold text-slate-700">{totalJobs} jobs</span>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 p-6 rounded-xl mb-6 shadow-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                {error}
              </div>
            </div>
          )}

          {jobsGrid}
        </section>

        {/* Video Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-green-700 to-blue-700 bg-clip-text text-transparent">
            Career Resources
          </h2>
          {loadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`video-skeleton-${index}`}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video w-full bg-gradient-to-r from-slate-200 to-blue-200"></div>
                  <div className="p-6">
                    <div className="h-5 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-full mb-4"></div>
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-blue-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <VideoSection videos={videos} />
          )}
        </section>
        {/* <AboutUs />
    
        <ContactUs /> */}
        <Testimonial />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                laddernest
              </h2>
              <p className="text-slate-300">Find your dream job today</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-slate-400">Connecting talent with opportunity</span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-300 mb-2">&copy; {new Date().getFullYear()} laddernest. All rights reserved.</p>
              <p className="text-sm text-slate-400">Built with ❤️ for your career success</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}