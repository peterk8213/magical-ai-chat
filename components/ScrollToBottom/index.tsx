"use client"

import { ChevronDown } from "lucide-react"

interface ScrollToBottomProps {
  onClick: () => void
}

export function ScrollToBottom({ onClick }: ScrollToBottomProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full p-2 flex items-center space-x-1 text-xs shadow-lg transition-all"
    >
      <span>Scroll to bottom</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  )
}

