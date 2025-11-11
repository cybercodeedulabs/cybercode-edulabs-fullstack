// netlify/functions/ask-ai.js

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, messages, courseContext } = body;

    // ✅ Ensure API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY in environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: Missing API key." }),
      };
    }

    // ✅ Use built-in fetch (Node 18+)
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
            content: `You are Cybercode EduLabs' AI Course Advisor. Use the provided course data to help users.
            ${courseContext}`,
          },
          ...(messages || []),
          { role: "user", content: prompt || "No question provided." },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "OpenAI API request failed.",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function crashed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error in ask-ai function." }),
    };
  }
}
