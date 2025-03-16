"use client"

import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LowCreditsWarningProps {
  credits: number
}

export function LowCreditsWarning({ credits }: LowCreditsWarningProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (credits <= 20) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [credits])

  if (credits > 20) return null

  return (
    <div
      className={cn(
        "fixed bottom-20 left-0 right-0 mx-auto max-w-md bg-red-900/80 text-white p-4 rounded-xl shadow-lg text-center z-50 border border-red-700 transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      <div className="flex items-center justify-center space-x-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-300" />
        <p className="font-medium">Low Credits Warning</p>
      </div>
      <p className="text-sm mb-3">You only have {credits} credits left. Each message costs 10 credits.</p>
      <Link href="/buy-credits">
        <button className="bg-white text-red-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors">
          Buy More Credits
        </button>
      </Link>
    </div>
  )
}

