// This is a fallback implementation that doesn't require Ollama
// It returns mock responses for demonstration purposes

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the last user message
  const { messages } = await req.json();
  console.log(messages);
  const lastUserMessage =
    messages.filter((m) => m.role === "user").pop()?.content || "";

  // Simple response generation based on the user's message
  let response =
    "I'm sorry, I couldn't connect to the AI model. This is a fallback response.";

  if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
    response =
      "Hello! I'm currently running in fallback mode because Ollama isn't connected. How can I help you today?";
  } else if (lastUserMessage.includes("help")) {
    response =
      "I'd like to help, but I'm currently running in fallback mode. To use the full AI capabilities, please make sure Ollama is running locally.";
  } else if (lastUserMessage.includes("?")) {
    response =
      "That's an interesting question! To get a proper AI-generated answer, please make sure Ollama is running locally.";
  }

  // Add instructions on how to run Ollama
  response +=
    "\n\n**Note:** To use the full AI capabilities, run `ollama run llama2` in your terminal.";

  // Simulate a delay to make it feel more natural
  await new Promise((resolve) => setTimeout(resolve, 100));

  return NextResponse.json({
    messages: [{ role: "assistant", content: response }],
  });
}
