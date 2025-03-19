"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Square } from "lucide-react";
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

  // Auto-resize textarea
  useEffect(() => {
    try {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
      }
    } catch (error) {
      console.error("Error resizing textarea:", error);
    }
  }, [input]);

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

  console.log("isLoading " + isLoading);

  return (
    <div className="border-t border-zinc-800 bg-black p-4 sticky bottom-0">
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            rows={2}
            disabled={isLoading || credits < 10}
            className="w-full resize-none bg-zinc-800/50 rounded-xl border border-zinc-700 px-4 py-4 pr-14 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:ring-offset-1 focus:ring-offset-black disabled:opacity-50 transition-all duration-200"
            style={{
              minHeight: "70px",
              maxHeight: "300px",
            }}
            aria-label="Message input"
          />

          {/* Send/Stop Button inside the textarea */}
          <Button
            type={isLoading ? "button" : "submit"}
            size="icon"
            disabled={(!input.trim() && !isLoading) || credits < 10}
            onClick={isLoading ? stopGeneration : (e) => handleSubmit(e as any)}
            className={cn(
              "absolute right-3 bottom-3 h-9 w-9 rounded-full shadow-lg transition-all duration-200",
              isLoading
                ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                : "bg-zinc-600 hover:bg-zinc-500 text-white"
            )}
            aria-label={isLoading ? "Stop generation" : "Send message"}
          >
            {isLoading ? (
              <Square className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs">
          {/* Standard HTML Select for AI Modes */}
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="appearance-none bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-zinc-300 px-3 py-1.5 pr-8 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              aria-label="Select AI mode"
            >
              {AI_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
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
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
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
