import { groq } from "@ai-sdk/groq"

// Configure AI models
export const models = {
  qwen: groq("qwen-qwq-32b"),
  fallback: groq("llama2-70b"),
}

// System prompts based on mode
export const getSystemPrompt = (mode: string, userPreferences: any = null) => {
  // Base system prompt
  let systemPrompt = "You are a helpful AI assistant. Format your responses clearly with proper markdown."

  // If user preferences exist, incorporate them into the system prompt
  if (userPreferences) {
    try {
      const { name, interests, responseLength, topics } = userPreferences

      // Add user name if provided
      const userName = name ? `Address the user as ${name}.` : ""

      // Add response length instructions
      let lengthInstructions = ""
      switch (responseLength) {
        case "concise":
          lengthInstructions = "Keep your responses concise and to the point."
          break
        case "detailed":
          lengthInstructions = "Provide detailed and comprehensive responses."
          break
        default:
          lengthInstructions = "Provide moderately detailed responses."
      }

      // Add interests if provided
      const interestsText =
        interests && interests.length > 0 ? `The user is interested in: ${interests.join(", ")}.` : ""

      // Add topics if provided
      const selectedTopics = Object.entries(topics || {})
        .filter(([_, isSelected]) => isSelected)
        .map(([topic]) => topic)

      const topicsText =
        selectedTopics.length > 0
          ? `The user is particularly interested in these topics: ${selectedTopics.join(", ")}.`
          : ""

      // Combine all preferences into the system prompt
      systemPrompt = `You are a helpful AI assistant. ${userName} ${lengthInstructions} ${interestsText} ${topicsText} Format your responses clearly with proper markdown.`
    } catch (error) {
      console.error("Error processing user preferences:", error)
      // Fall back to default system prompt if there's an error
    }
  }

  // Add mode-specific instructions
  switch (mode) {
    case "friend":
      systemPrompt += " You are a friendly and casual AI companion. Use conversational language and be supportive."
      break
    case "advisor":
      systemPrompt += " You are a professional advisor. Provide thoughtful, well-structured advice with a formal tone."
      break
    case "doctor":
      systemPrompt +=
        " You are a medical consultant. Provide health information with appropriate disclaimers. Always recommend consulting with a real doctor."
      break
    default:
      // Default assistant mode
      break
  }

  return systemPrompt
}

