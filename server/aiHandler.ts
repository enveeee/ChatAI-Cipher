import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ path: ".env" });

// Groq is OpenAI-compatible, just different baseURL
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free & fast
      messages: [
        {
          role: "system",
          content:
            "You are Cipher, a sharp and intelligent AI assistant built into a real-time chat app. Be concise, friendly, and insightful. Keep responses under 200 words.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 300,
    });

    return (
      response.choices[0]?.message?.content ||
      "Sorry, I could not generate a response."
    );
  } catch (error) {
    console.error("Groq error:", error);
    return "Cipher is currently unavailable. Please try again later.";
  }
}