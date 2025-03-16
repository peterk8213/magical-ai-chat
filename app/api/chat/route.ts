import { streamText } from "ai";
import { models, getSystemPrompt } from "@/lib/ai-config";
import { NextResponse } from "next/server";

// Set a longer timeout for the API route
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages, mode = "assistant", chatId, userPreferences } = data;
    console.log(data);

    // Create system message based on selected mode and user preferences
    const systemPrompt = getSystemPrompt(mode, userPreferences);

    // Format messages for the API
    const formattedMessages = [
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Get the last user message for the prompt
    const lastUserMessage =
      formattedMessages.filter((m: any) => m.role === "user").pop()?.content ||
      "";

    // Use AI SDK to stream the response
    const stream = streamText({
      model: models.qwen,
      // prompt: lastUserMessage,
      system: systemPrompt,
      messages: formattedMessages,
    });

    // Return a streaming response
    console.log("done  not me");

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Error processing your request: " + (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
