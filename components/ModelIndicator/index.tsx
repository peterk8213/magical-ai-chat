import { Cpu } from "lucide-react"

interface ModelIndicatorProps {
  model: string
}

export function ModelIndicator({ model }: ModelIndicatorProps) {
  return (
    <div className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-full">
      <Cpu className="h-3 w-3" />
      <span>{model}</span>
    </div>
  )
}

