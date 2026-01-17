"use client"

import React from 'react'
import { Play, Clock, Eye } from 'lucide-react'

export const VideoSection = React.memo(function VideoSection({ videos }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-slate-600">No video resources available at the moment.</p>
      </div>
    )
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
    const videoId = getYouTubeVideoId(url)
    if (!videoId) return '/placeholder-video.jpg' // fallback image
    
    // YouTube thumbnail qualities: default, hqdefault, mqdefault, sddefault, maxresdefault
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  // Function to format duration
  const formatDuration = (duration) => {
    if (!duration) return ''
    
    // If duration is in seconds
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60)
      const seconds = duration % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    
    // If duration is already formatted
    return duration
  }

  // Function to format view count
  const formatViewCount = (views) => {
    if (!views) return '0'
    
    if (typeof views === 'number') {
      if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`
      } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`
      }
      return views.toString()
    }
    
    return views
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <div key={video.id || video._id || index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          {/* Video Thumbnail */}
          <div className="relative aspect-video group cursor-pointer">
            <img
              src={getYouTubeThumbnail(video.url || video.videoUrl || video.link)}
              alt={video.title || 'Video thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if thumbnail fails to load
                e.target.src = '/placeholder-video.jpg'
              }}
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-3">
                <Play className="h-6 w-6 text-slate-800 fill-current" />
              </div>
            </div>
            
            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(video.duration)}
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
              {video.title || 'Untitled Video'}
            </h3>
            
            {video.description && (
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-slate-500">
              {video.views && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{formatViewCount(video.views)} views</span>
                </div>
              )}
              
              <a
                href={video.url || video.videoUrl || video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs"
              >
                <Play className="h-3 w-3 mr-1 fill-current" />
                Watch
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})