// netlify/functions/ask-ai.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { prompt, messages, courseContext } = body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are Cybercode EduLabs' AI Course Advisor. Use the course data below to answer accurately.
            ${courseContext}`,
          },
          ...messages,
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in ask-ai function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI request failed." }),
    };
  }
}
