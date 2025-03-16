"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Square } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  setMode: (mode: string) => void;
  mode: string;
  credits: number;
  stopGeneration?: () => void;
}

const AI_MODES = [
  { value: "assistant", label: "AI Assistant" },
  { value: "friend", label: "Friendly Chat" },
  { value: "advisor", label: "Professional Advisor" },
  { value: "doctor", label: "Medical Consultant" },
];

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  setMode,
  mode,
  credits,
  stopGeneration,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showModes, setShowModes] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    try {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    } catch (error) {
      console.error("Error resizing textarea:", error);
    }
  }, [input]);

  // Auto-focus textarea on component mount or input change
  useEffect(() => {
    try {
      if (textareaRef.current && !isLoading) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error("Error focusing textarea:", error);
    }
  }, [isLoading, input]);

  // Close modes dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        if (showModes && !target.closest('[data-modes="true"]')) {
          setShowModes(false);
        }
      } catch (error) {
        console.error("Error handling click outside:", error);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModes]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    try {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    } catch (error) {
      console.error("Error handling key down:", error);
    }
  };

  const handleModeClick = (value: string) => {
    try {
      setMode(value);
      setShowModes(false);
    } catch (error) {
      console.error("Error setting mode:", error);
    }
  };

  const getCurrentModeLabel = () => {
    try {
      return AI_MODES.find((m) => m.value === mode)?.label || "AI Assistant";
    } catch (error) {
      console.error("Error getting current mode label:", error);
      return "AI Assistant";
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-black p-4 sticky bottom-0">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
          disabled={isLoading || credits < 10}
          className="w-full resize-none bg-zinc-800/50 rounded-xl border border-zinc-700 px-4 py-3 pr-12 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 transition-all duration-200"
          style={{
            minHeight: "50px",
            maxHeight: "200px",
          }}
          aria-label="Message input"
        />

        {/* Combined Send/Stop Button */}
        <Button
          type={isLoading ? "button" : "submit"}
          size="icon"
          disabled={(!input.trim() && !isLoading) || credits < 10}
          onClick={isLoading ? stopGeneration : (e) => handleSubmit(e as any)}
          className={cn(
            "absolute right-3 bottom-3 h-9 w-9 rounded-full shadow-lg transition-all duration-200",
            isLoading
              ? "bg-zinc-700 hover:bg-zinc-600 text-white"
              : "bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/20"
          )}
          aria-label={isLoading ? "Stop generation" : "Send message"}
        >
          {isLoading ? (
            <Square className="h-4 w-4" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center justify-between mt-3 text-xs">
          {/* Clickable AI Modes */}
          <div className="relative" data-modes="true">
            <button
              onClick={() => setShowModes(!showModes)}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-zinc-300 transition-colors"
            >
              <span>{getCurrentModeLabel()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  showModes ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showModes && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-10 w-48 py-1 border border-zinc-700">
                {AI_MODES.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleModeClick(m.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-zinc-700 transition-colors",
                      mode === m.value
                        ? "bg-zinc-700/50 text-white"
                        : "text-zinc-300"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className={`${
              credits < 10 ? "text-red-500 font-medium" : "text-zinc-400"
            } flex items-center`}
          >
            {credits < 10 ? (
              <Link
                href="/buy-credits"
                className="text-red-500 hover:text-red-400 underline"
              >
                Buy more credits
              </Link>
            ) : (
              <span>Cost: 10 credits per message</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
