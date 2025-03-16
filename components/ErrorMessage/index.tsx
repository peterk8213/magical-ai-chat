"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md bg-red-900/80 text-white p-4 rounded-lg shadow-lg text-center z-50 border border-red-700">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-300" />
        <p className="font-medium">Error</p>
      </div>
      <p className="text-sm mb-3">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-white text-red-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      )}
    </div>
  )
}

