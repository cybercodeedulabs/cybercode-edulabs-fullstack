// netlify/functions/ask-ai.js

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, messages, courseContext } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing OpenRouter API key");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: Missing API key." }),
      };
    }

    // ✅ Use OpenRouter API instead of OpenAI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://cybercodeedulabs.netlify.app", // Optional: for attribution
        "X-Title": "Cybercode EduLabs AI Advisor",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // You can change to 'mistralai/mixtral-8x7b' or others later
        messages: [
          {
            role: "system",
            content: `You are Cybercode EduLabs' official AI course advisor. 
            Use the course data below to help users. 
            Only refer to Cybercode EduLabs courses and provide accurate details.
            ${courseContext}`,
          },
          ...(messages || []),
          { role: "user", content: prompt || "No question provided." },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "OpenRouter API request failed.",
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
