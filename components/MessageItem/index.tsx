"use client";

import type { Message } from "ai";
import { Copy, CheckCheck, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useState, useEffect, useRef } from "react";

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
  animate: boolean;
  isStreaming?: boolean; // Add this new prop
  status: string;
}

export function MessageItem({
  message,
  isLast,
  animate,
  isStreaming,
  status,
}: MessageItemProps) {
  const isAssistant = message.role === "assistant";
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(isAssistant && isLast);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingIndexRef = useRef(0);

  const copyToClipboard = () => {
    if (navigator.clipboard && isAssistant) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (!isAssistant) {
        setDisplayedContent(message.content);
      }
    }, 5);
    return () => clearTimeout(timer);
  }, [isAssistant, message.content]);

  // Typing animation effect
  useEffect(() => {
    if (isAssistant && isLast && animate) {
      // Start typing immediately when streaming begins
      typingIndexRef.current = 0;
      setDisplayedContent("");
      setIsTyping(true);

      // Calculate typing speed based on content length
      // We'll use a faster speed for production
      const charsPerInterval = Math.max(
        5,
        Math.ceil(message.content.length / 100)
      );

      const startTyping = () => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

        typingIntervalRef.current = setInterval(() => {
          if (typingIndexRef.current < message.content.length) {
            setDisplayedContent((prev) =>
              message.content.substring(
                0,
                typingIndexRef.current + charsPerInterval
              )
            );
            typingIndexRef.current += charsPerInterval;
          } else {
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
              setIsTyping(false);
            }
          }
        }, 10); // Faster interval for production
      };

      startTyping();

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    } else if (!isTyping && isAssistant) {
      setDisplayedContent(message.content);
    }
  }, [isAssistant, animate, message.content, status]);

  // Add a new useEffect to handle content updates during streaming
  useEffect(() => {
    // This effect handles updating the displayed content during streaming
    // as new content arrives from the API
    if (isAssistant && isLast && isTyping) {
      // When streaming is active and we're typing, we need to
      // adjust our typing to keep pace with incoming content
      const contentLength = message.content.length;
      const displayedLength = typingIndexRef.current;

      // If we're falling behind (new content is coming in faster than we're typing)
      // speed up to catch up
      if (contentLength - displayedLength > 50) {
        const charsToAdd = Math.min(20, contentLength - displayedLength);
        typingIndexRef.current += charsToAdd;
        setDisplayedContent(
          message.content.substring(0, typingIndexRef.current)
        );
      }
    }
  }, [isAssistant, isLast, isStreaming, isTyping, message.content]);

  if (!isAssistant && message.content.trim() === "") {
    return null;
  }

  useEffect(() => {
    if (isLast && isAssistant && isStreaming) {
      setIsTyping(true);
    }
  }, [isAssistant, isLast, isStreaming]);

  return (
    <div className={cn("py-6 first:pt-0 transition-opacity duration-500")}>
      <div className="max-w-3xl mx-auto p-2">
        {!isAssistant && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-red-600 flex-shrink-0 flex items-center justify-center text-xs font-medium">
              You
            </div>
            <div
              className={
                "text-zinc-100 whitespace-pre-wrap bg-zinc-900/50 rounded-xl px-4 my-2 py-6 prose prose-invert max-w-none"
              }
            >
              {message.content}
            </div>
          </div>
        )}

        {isAssistant && (
          <div className="relative group">
            <div className="flex items-start gap-4">
              <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background gap-3">
                <SparklesIcon className="w-6 h-5" />

                <p>AI</p>
              </div>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";
                      return !inline && language ? (
                        <SyntaxHighlighter
                          language={language}
                          style={atomDark}
                          wrapLines={true}
                          PreTag="div"
                          customStyle={{
                            margin: "1em 0",
                            borderRadius: "0.375rem",
                            background: "#18181b",
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className={cn(
                            "bg-zinc-800 px-1.5 py-0.5 rounded text-sm",
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    // Style other markdown elements
                    p: ({ children }) => (
                      <p className="mb-4 last:mb-0">{children}</p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mb-2">{children}</h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-zinc-700 pl-4 italic mb-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {isTyping && (
                  <span className="inline-block w-2 h-4 bg-zinc-300 ml-1 animate-pulse" />
                )}
              </div>
            </div>

            <div>
              <button
                onClick={copyToClipboard}
                className={cn(
                  "absolute top-0 right-0 p-2 text-zinc-500 hover:text-zinc-300 transition-opacity",
                  copied
                    ? "text-green-500"
                    : "opacity-0 group-hover:opacity-100"
                )}
                aria-label="Copy response"
              >
                {copied ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied && (
                  <span className="absolute right-0 top-8 text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
