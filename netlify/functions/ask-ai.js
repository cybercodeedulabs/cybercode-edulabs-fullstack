// netlify/functions/ask-ai.js
// GROQ (Llama 3.1) backend for Cybercode AI Advisor
// Requires GROQ_API_KEY in Netlify environment variables.

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const {
      prompt = "",
      messages = [],
      courseContext = "",
      userGoals = {},
      personaScores = {},
      userStats = {},
    } = body;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Server misconfigured: Missing GROQ_API_KEY.",
        }),
      };
    }

    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    // -------------------------------------------------------
    // 🔥 SMART SYSTEM PROMPT — THIS FIXES ALL ISSUES
    // -------------------------------------------------------
    const systemPrompt = `
You are **Cybercode EduLabs AI Advisor**, an intelligent assistant that helps learners with:

✔ Course explanations  
✔ Career guidance (ONLY if requested)  
✔ Roadmaps (ONLY when clearly asked)  
✔ Doubt clarification  
✔ Friendly conversational support  

### 🔹 BEHAVIOR RULES
- If user says: "hi", "hello", "hey" → Reply with a short friendly greeting.
- If user asks about a course → Use courseContext to answer.
- If user asks for a roadmap / guidance → Use userGoals, personaScores, and userStats.
- If message is unclear → Ask for clarification politely.
- NEVER assume career goals unless user explicitly asks.
- ALWAYS return clean, readable **markdown**.
- Use headings, bullet points, spacing.
- Keep responses crisp unless user asks for deep detail.

### 🔹 Dynamic Context (ONLY used when relevant)
USER_GOALS:
${JSON.stringify(userGoals, null, 2)}

USER_STATS:
${JSON.stringify(userStats, null, 2)}

PERSONA_SCORES:
${JSON.stringify(personaScores, null, 2)}

COURSE_CONTEXT:
${courseContext.substring(0, 20000)}
`;

    // -------------------------------------------------------
    // Build message chain
    // -------------------------------------------------------
    const groqMessages = [
      { role: "system", content: systemPrompt },

      ...messages.map((m) => ({
        role: m.role || (m.from === "user" ? "user" : "assistant"),
        content: m.content || m.text || "",
      })),

      { role: "user", content: prompt },
    ];

    const requestBody = {
      model,
      messages: groqMessages,
      temperature: 0.3,
      max_tokens: 1800,
    };

    // -------------------------------------------------------
    // Send to GROQ
    // -------------------------------------------------------
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Groq JSON parse error:", err);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Invalid response from Groq API." }),
      };
    }

    if (!res.ok) {
      console.error("Groq error:", data);
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: data?.error?.message || "Groq API request failed.",
          raw: data,
        }),
      };
    }

    // -------------------------------------------------------
    // Extract output
    // -------------------------------------------------------
    let outText = data?.choices?.[0]?.message?.content || "";

    // Auto-beautify formatting
    outText = outText
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // -------------------------------------------------------
    // Return in OpenAI-compatible format (Frontend expects this)
    // -------------------------------------------------------
    return {
      statusCode: 200,
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: outText,
            },
          },
        ],
        raw: data,
      }),
    };

  } catch (error) {
    console.error("ask-ai crashed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error in ask-ai function.",
      }),
    };
  }
}
