"use client";

import type { Message } from "ai";
import type { RefObject } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "@/components/MessageItem";
import { Loader2 } from "lucide-react";
import { memo, useCallback } from "react";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  setInput?: (input: string) => void;
  stopGeneration?: () => void;
  isStreaming?: boolean;
}

// Conversation starters with display text and full prompts
const CONVERSATION_STARTERS = [
  {
    display: "Tell me a story about dragons",
    prompt:
      "Tell me an original short story about dragons in a medieval fantasy setting. Include a hero, a conflict, and a resolution.",
  },
  {
    display: "What are the best practices for React?",
    prompt:
      "What are the current best practices for React development? Include information about hooks, state management, performance optimization, and component architecture.",
  },
  {
    display: "Help me plan a vacation",
    prompt:
      "I want to plan a 7-day vacation. Can you help me create an itinerary with activities, accommodation suggestions, and travel tips? I'm interested in both relaxation and adventure.",
  },
  {
    display: "Explain quantum computing",
    prompt:
      "Explain quantum computing to me in simple terms. What makes it different from classical computing? What are qubits and quantum superposition? What are the potential applications of quantum computers?",
  },
];

// Using memo to prevent unnecessary re-renders
export const MessageList = memo(function MessageList({
  messages,
  messagesEndRef,
  isLoading,
  setInput,
  stopGeneration,
  isStreaming,
}: MessageListProps) {
  // Safe handler for starter clicks with useCallback
  const handleStarterClick = useCallback(
    (starter: (typeof CONVERSATION_STARTERS)[0]) => {
      if (setInput) {
        setInput(starter.prompt);
      }
    },
    [setInput]
  );

  return (
    <ScrollArea className="h-[calc(100vh-9.5rem)] messages-container pt-4">
      <div className="space-y-6 max-w-3xl mx-auto px-2 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)] text-center">
            <div className="bg-zinc-900/50 p-6 rounded-xl max-w-md">
              <h3 className="text-xl font-medium mb-2">Welcome to MagicalAI</h3>
              <p className="text-zinc-400 mb-4">
                Start a conversation by typing a message below. Your chat
                history will appear here.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {CONVERSATION_STARTERS.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterClick(starter)}
                    className="bg-zinc-800 p-3 rounded-lg text-left hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    "{starter.display}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div>
              <MessageItem
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                animate={isLoading}
                isStreaming={isLoading}
                status={message.status}

              />
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-zinc-400 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
});
