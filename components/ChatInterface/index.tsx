"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { LowCreditsWarning } from "@/components/LowCreditsWarning";
import { ErrorMessage } from "@/components/ErrorMessage";

import { useWorldAuth } from "next-world-auth/react";

interface ChatInterfaceProps {
  chatId?: string;
}
interface User {
  walletAddress: string;
  username: string;
  isHuman: boolean;
}

export function ChatInterface({ chatId = "default" }: ChatInterfaceProps) {
  const { isInstalled, isAuthenticated, session, signIn, signOut } =
    useWorldAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [mode, setMode] = useState("assistant");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [model, setModel] = useState("qwen-qwq-32b");
  const [apiEndpoint, setApiEndpoint] = useState("/api/chat");
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const {
    user: { username },
  } = session as { user: User };

  // Load user preferences from localStorage with useMemo for caching
  const userPreferences = useMemo(() => {
    try {
      const storedPreferences = localStorage.getItem("userPreferences");
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
      return null;
    } catch (error) {
      console.error("Error loading user preferences:", error);
      return null;
    }
  }, []);

  // Update the useChat hook with improved error handling
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    status,

    error,
    stop,
    reload,
  } = useChat({
    api: apiEndpoint,
    id: chatId,
    initialMessages: [],

    body: {
      mode: mode,
      chatId: chatId,
      userPreferences: userPreferences, // Pass user preferences to the API
    },
    onFinish: () => {
      // // Save chat to local storage when a message is completed
      // saveChat(chatId, messages);
      // // Clear any error message on successful completion
      setErrorMessage(null);
      console.log("done", messages);
    },
    onError: (error) => {
      console.error("Chat error:", error);

      // Set a more user-friendly error message
      setErrorMessage(
        error.message || "An error occurred while processing your request"
      );

      // If we get an error and haven't tried the fallback yet, switch to fallback
      if (apiEndpoint !== "/api/chat/fallback-route" && retryCount < 2) {
        console.log("Switching to fallback route");
        setApiEndpoint("/api/chat/fallback-route");
        setRetryCount(retryCount + 1);

        // Try to reload with the new endpoint
        setTimeout(() => {
          reload();
        }, 500);
      }
    },
  });

  // Safe implementation of setInput
  const setInput = useCallback(
    (text: string) => {
      try {
        // We need to access the underlying setter from useChat
        handleInputChange({
          target: { value: text },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      } catch (error) {
        console.error("Error setting input:", error);
      }
    },
    [handleInputChange]
  );

  // Handle retry with improved error handling
  const handleRetry = useCallback(() => {
    setErrorMessage(null);

    // If we're already on the fallback route, try the main route again
    if (apiEndpoint === "/api/chat/fallback-route") {
      setApiEndpoint("/api/chat");
    }

    // Wait a moment before reloading
    setTimeout(() => {
      try {
        reload();
      } catch (error) {
        console.error("Error reloading chat:", error);
        setErrorMessage("Failed to reload the chat. Please try again.");
      }
    }, 300);
  }, [reload, apiEndpoint]);

  // Load credits from local storage with useMemo
  const initialCredits = useMemo(() => {
    try {
      const storedCredits = localStorage.getItem("userCredits");
      if (storedCredits) {
        return Number.parseInt(storedCredits);
      }
      localStorage.setItem("userCredits", "100");
      return 100;
    } catch (error) {
      console.error("Error loading credits:", error);
      return 100;
    }
  }, []);

  // Use state with the memoized initial value
  const [credits, setCredits] = useState(initialCredits);

  // Check credits and redirect if needed
  const checkCreditsAndRedirect = useCallback(() => {
    if (credits < 10) {
      router.push("/buy-credits");
    }
  }, [credits, router]);

  // Check credits when the component mounts
  useEffect(() => {
    checkCreditsAndRedirect();
  }, [credits, checkCreditsAndRedirect]);

  // Custom handleSubmit with improved error handling
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // Clear any previous error message
        setErrorMessage(null);

        // Check if user has enough credits
        if (credits < 10) {
          router.push("/buy-credits");
          return;
        }

        // If this is the first interaction and we're using the default chatId, generate a new one
        if (!hasInteracted && chatId === "default") {
          const newChatId = nanoid();

          // Update URL without full page reload
          window.history.pushState({}, "", `/chat/${newChatId}`);

          // Set the flag to prevent further ID generation
          setHasInteracted(true);
        }

        // Deduct credits
        const newCredits = credits - 10;
        setCredits(newCredits);
        localStorage.setItem("userCredits", newCredits.toString());

        // Call the original handleSubmit
        originalHandleSubmit(e);
      } catch (error) {
        console.error("Error submitting message:", error);
        setErrorMessage("Failed to send your message. Please try again.");
      }
    },
    [
      credits,
      hasInteracted,
      chatId,
      router,
      originalHandleSubmit,
      setHasInteracted,
    ]
  );

  // Check if we should show scroll button
  useEffect(() => {
    const checkScrollPosition = () => {
      const messagesContainer = document.querySelector(".messages-container");
      if (messagesContainer) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 0);
      }
    };

    const messagesContainer = document.querySelector(".messages-container");
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", checkScrollPosition);
      return () =>
        messagesContainer.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (status == "ready" || status == "streaming") {
      scrollToBottom();
    }
  }, [messages, status]);

  // Load chat history from local storage
  useEffect(() => {
    loadChats();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) {
      // Mobile behavior
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      // Desktop behavior
      setSidebarVisible(!sidebarVisible);
    }
  }, [isSidebarOpen, sidebarVisible]);

  // Save chat to local storage with improved error handling
  const saveChat = useCallback((id: string, messages: any[]) => {
    if (messages.length === 0) return;

    try {
      // Get existing chats
      const chatsJson = localStorage.getItem("chats") || "{}";
      const chats = JSON.parse(chatsJson);

      // Get the first user message as title, or use default
      const firstUserMessage = messages.find((m) => m.role === "user");
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 30) +
          (firstUserMessage.content.length > 30 ? "..." : "")
        : "New Chat";

      // Update chat in storage
      chats[id] = {
        id,
        title,
        lastMessage: new Date().toISOString(),
        preview:
          messages[messages.length - 1]?.content.slice(0, 50) + "..." || "",
      };

      localStorage.setItem("chats", JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  }, []);

  // Load chats from local storage with improved error handling
  const loadChats = useCallback(() => {
    try {
      const chatsJson = localStorage.getItem("chats") || "{}";
      return JSON.parse(chatsJson);
    } catch (error) {
      console.error("Error loading chats:", error);
      return {};
    }
  }, []);

  // Create a new chat with improved error handling
  const createNewChat = useCallback(() => {
    try {
      // Instead of redirecting, just clear the messages and reset the state
      window.history.pushState({}, "", `/`);
      window.location.reload(); // Force reload to clear the state
    } catch (error) {
      console.error("Error creating new chat:", error);
      // Fallback to direct navigation
      router.push("/");
    }
  }, [router]);

  console.log("message", status);
  console.log(messages);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentChatId={chatId}
        onNewChat={createNewChat}
        toggleSidebar={toggleSidebar}
        credits={credits}
        username={username}
      />
      <div
        className={`flex flex-col flex-1 h-screen w-full transition-all duration-300 ${
          !sidebarVisible ? "md:ml-0" : "md:ml-[280px]"
        }`}
      >
        <ChatHeader
          toggleSidebar={toggleSidebar}
          chatId={chatId}
          credits={credits}
          model={apiEndpoint.includes("fallback") ? "Fallback Mode" : model}
        />
        <div className="flex-1 overflow-hidden relative mt-5">
          <MessageList
            messages={messages}
            messagesEndRef={messagesEndRef}
            isLoading={status == "submitted" || status == "streaming"}
            isStreaming={status == "streaming"}
            setInput={setInput}
          />
          {showScrollButton && <ScrollToBottom onClick={scrollToBottom} />}
          {(error || errorMessage) && (
            <ErrorMessage
              message={
                errorMessage || (error ? error.message : "An error occurred")
              }
              onRetry={handleRetry}
            />
          )}
          <LowCreditsWarning credits={credits} />
        </div>
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status == "streaming" || status == "submitted"}
          mode={mode}
          setMode={setMode}
          credits={credits}
          stopGeneration={stop}
        />
      </div>
    </div>
  );
}
