// import { StreamingTextResponse } from "ai"
// import { streamText } from "ai"
// import { models, getSystemPrompt } from "@/lib/ai-config"

// // Set a longer timeout for the API route
// export const maxDuration = 30

// export async function POST(req: Request) {
//   try {
//     const { messages, mode = "assistant", chatId, userPreferences } = await req.json()

//     // Create system message based on selected mode and user preferences
//     const systemPrompt =
//       getSystemPrompt(mode, userPreferences) +
//       "\nYou are currently running in fallback mode. The primary AI service is experiencing issues."

//     // Get the last user message
//     const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || ""

//     // Use AI SDK with fallback model
//     const stream = await streamText({
//       model: models.fallback,
//       prompt: lastUserMessage,
//       system: systemPrompt,
//       messages: messages.map((m: any) => ({
//         role: m.role,
//         content: m.content,
//       })),
//     })

//     // Return a streaming response
//     return new StreamingTextResponse(stream)
//   } catch (error) {
//     console.error("Error in fallback route:", error)
//     return new Response(JSON.stringify({ error: "Error processing your request in fallback mode" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     })
//   }
// }
