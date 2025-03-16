import { Loader2 } from "lucide-react"

export function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div className="bg-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-4" />
        <p className="text-white font-medium">Loading MagicalAI...</p>
      </div>
    </div>
  )
}

