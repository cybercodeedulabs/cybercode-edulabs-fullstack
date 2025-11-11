// netlify/functions/ask-ai.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    // ✅ Parse body safely
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, messages, courseContext } = body;

    // ✅ Check for OpenAI key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OpenAI API key");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: missing API key." }),
      };
    }

    // ✅ Prepare OpenAI request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are Cybercode EduLabs' AI Advisor. Use the course data below to help users.
            ${courseContext}`,
          },
          ...(messages || []),
          { role: "user", content: prompt || "No question provided." },
        ],
      }),
    });

    const data = await response.json();

    // ✅ Handle API errors
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "OpenAI request failed" }),
      };
    }

    // ✅ Return AI response to frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function crashed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in ask-ai function." }),
    };
  }
}
