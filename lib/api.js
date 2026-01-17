// API utility functions for frontend components

// Jobs API
export async function fetchJobs(filters = {}, searchTerm = "", page = 1, limit = 10) {
  try {
    const queryParams = new URLSearchParams()

    // Add filters
    if (filters.jobType && filters.jobType !== "All") {
      queryParams.append("jobType", filters.jobType)
    }

    if (filters.category && filters.category !== "All") {
      queryParams.append("category", filters.category)
    }

    if (filters.degree && filters.degree !== "All") {
      queryParams.append("degree", filters.degree)
    }

    if (filters.location && filters.location !== "All") {
      queryParams.append("location", filters.location)
    }

    // Add search term
    if (searchTerm) {
      queryParams.append("search", searchTerm)
    }

    // Add pagination
    queryParams.append("page", page)
    queryParams.append("limit", limit)

    const response = await fetch(`/api/jobs?${queryParams.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch jobs")
    }

    return data
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error
  }
}

export async function fetchJobById(id) {
  try {
    const response = await fetch(`/api/jobs/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch job")
    }

    return data
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error)
    throw error
  }
}

export async function createJob(jobData) {
  try {
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

    return data
  } catch (error) {
    console.error("Error creating job:", error)
    throw error
  }
}

export async function updateJob(id, jobData) {
  try {
    const response = await fetch(`/api/jobs/${id}`, {
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

    return data
  } catch (error) {
    console.error(`Error updating job ${id}:`, error)
    throw error
  }
}

export async function deleteJob(id) {
  try {
    const response = await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete job")
    }

    return data
  } catch (error) {
    console.error(`Error deleting job ${id}:`, error)
    throw error
  }
}

export async function toggleJobStatus(id) {
  try {
    const response = await fetch(`/api/jobs/${id}/activate`, {
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle job status")
    }

    return data
  } catch (error) {
    console.error(`Error toggling job status ${id}:`, error)
    throw error
  }
}

// Videos API
export async function fetchVideos(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/videos?page=${page}&limit=${limit}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch videos")
    }

    return data
  } catch (error) {
    console.error("Error fetching videos:", error)
    throw error
  }
}

export async function fetchVideoById(id) {
  try {
    const response = await fetch(`/api/videos/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch video")
    }

    return data
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error)
    throw error
  }
}

export async function createVideo(videoData) {
  try {
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

    return data
  } catch (error) {
    console.error("Error creating video:", error)
    throw error
  }
}

export async function updateVideo(id, videoData) {
  try {
    const response = await fetch(`/api/videos/${id}`, {
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

    return data
  } catch (error) {
    console.error(`Error updating video ${id}:`, error)
    throw error
  }
}

export async function deleteVideo(id) {
  try {
    const response = await fetch(`/api/videos/${id}`, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete video")
    }

    return data
  } catch (error) {
    console.error(`Error deleting video ${id}:`, error)
    throw error
  }
}

export async function toggleVideoStatus(id) {
  try {
    const response = await fetch(`/api/videos/${id}/activate`, {
      method: "POST",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle video status")
    }

    return data
  } catch (error) {
    console.error(`Error toggling video status ${id}:`, error)
    throw error
  }
}
