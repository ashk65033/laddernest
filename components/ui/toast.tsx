"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: string
}

export function Toast({ message, type }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)

      // Wait for exit animation to complete
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        } ${type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
      >
        {type === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
        <span>{message}</span>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => setIsVisible(false), 300)
          }}
          className="ml-4 text-slate-500 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export const ToastProvider = () => null
export const ToastViewport = () => null
export const ToastTitle = () => null
export const ToastDescription = () => null
export const ToastClose = () => null
export const ToastAction = () => null
