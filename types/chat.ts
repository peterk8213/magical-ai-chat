export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
}

export interface ChatRequest {
  messages: {
    role: "user" | "assistant"
    content: string
  }[]
}

export interface ChatResponse {
  content: string
}

