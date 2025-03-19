"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentChatId: string;
  onNewChat: () => void;
  toggleSidebar: () => void;
  credits: number;
  username?: string;
}

interface ChatItem {
  id: string;
  title: string;
  lastMessage: string;
  preview: string;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  currentChatId,
  onNewChat,
  toggleSidebar,
  credits,
  username,
}: SidebarProps) {
  const [chats, setChats] = useState<Record<string, ChatItem>>({});

  const router = useRouter();
  const [animateItems, setAnimateItems] = useState(false);

  // Load chats from local storage
  useEffect(() => {
    const loadChats = () => {
      try {
        const chatsJson = localStorage.getItem("chats") || "{}";
        setChats(JSON.parse(chatsJson));
      } catch (error) {
        console.error("Error loading chats:", error);
        setChats({});
      }
    };

    loadChats();

    // Set up event listener for storage changes
    const handleStorageChange = () => loadChats();
    window.addEventListener("storage", handleStorageChange);

    // Custom event for chat updates
    const handleChatUpdate = () => loadChats();
    window.addEventListener("chatUpdated", handleChatUpdate);

    // Load username from preferences if available
    const userPreferences = localStorage.getItem("userPreferences");
    if (userPreferences) {
      const { name } = JSON.parse(userPreferences);
      if (name) setUsername(name);
    }

    // Animate items after a short delay
    setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chatUpdated", handleChatUpdate);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest('[data-sidebar="true"]') &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Delete a chat
  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const chatsJson = localStorage.getItem("chats") || "{}";
      const chats = JSON.parse(chatsJson);

      delete chats[id];
      localStorage.setItem("chats", JSON.stringify(chats));

      // Update state
      setChats(chats);

      // If current chat is deleted, go to home
      if (id === currentChatId) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Sort chats by last message time
  const sortedChats = Object.values(chats).sort((a, b) => {
    return (
      new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
    );
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        data-sidebar="true"
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 font-bold">MagicalAI</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 hidden md:flex"
                onClick={toggleSidebar}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User profile section */}
          <Link href="/profile">
            <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 hover:bg-zinc-800 transition-colors rounded-xl mx-2 mt-2">
              <Avatar>
                <AvatarFallback className="bg-red-600">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{username}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{credits} credits</p>
                  {credits < 20 && (
                    <Link
                      href="/buy-credits"
                      className="text-xs text-red-500 hover:text-red-400"
                    >
                      Low credits!
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Link>

          <div className="p-4">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
              onClick={onNewChat}
            >
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-2">
              {sortedChats.length > 0 ? (
                sortedChats.map((chat, index) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800 transition-all duration-300",
                        chat.id === currentChatId ? "bg-zinc-800" : "",
                        animateItems
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start space-x-2 overflow-hidden">
                        <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0 text-zinc-500" />
                        <div className="overflow-hidden">
                          <div className="text-sm font-medium truncate">
                            {chat.title}
                          </div>
                          <div className="text-xs text-zinc-400 truncate">
                            {chat.preview}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-red-400"
                        onClick={(e) => deleteChat(chat.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-zinc-500 text-sm">
                  No chat history yet
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-zinc-800 mt-auto">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
