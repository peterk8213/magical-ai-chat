"use client"

import { Button } from "@/components/ui/button"
import { Menu, Search, Plus, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { ModelIndicator } from "@/components/ModelIndicator"

interface ChatHeaderProps {
  toggleSidebar: () => void
  chatId?: string
  credits: number
  model?: string
}

export function ChatHeader({ toggleSidebar, chatId, credits, model = "qwen-qwq-32b" }: ChatHeaderProps) {
  const [chatTitle, setChatTitle] = useState("")

  useEffect(() => {
    if (chatId) {
      try {
        const chatsJson = localStorage.getItem("chats") || "{}"
        const chats = JSON.parse(chatsJson)

        if (chats[chatId]) {
          setChatTitle(chats[chatId].title)
        } else {
          setChatTitle("New Chat")
        }
      } catch (error) {
        console.error("Error loading chat title:", error)
      }
    }
  }, [chatId])

  return (
    <header className="h-14 border-b border-zinc-800 bg-black flex items-center px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:flex text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={toggleSidebar}
        >
          {/* Mobile shows menu, desktop shows chevron */}
          <Menu className="h-5 w-5 md:hidden" />
          <ChevronRight className="h-5 w-5 hidden md:block" />
        </Button>
        <h2 className="text-lg font-semibold text-white truncate max-w-[200px] ml-2">{chatTitle}</h2>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <ModelIndicator model={model} />
        <div className="text-sm text-zinc-400">
          <span className="font-medium text-red-500">{credits}</span> credits
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

