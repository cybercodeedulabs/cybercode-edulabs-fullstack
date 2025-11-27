// netlify/functions/ask-ai.js
// GROQ (Llama 3.1) backend for Cybercode AI Advisor
// Requires GROQ_API_KEY in Netlify environment variables.

// Optional: GROQ_MODEL (defaults to llama-3.1-70b-versatile)

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const {
      prompt,
      messages = [],
      courseContext = "",
      userGoals,
      personaScores,
      userStats,
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

    // Recommended default model
    const model =
      process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    // ---- SYSTEM PROMPT ----
    const systemPrompt = `
You are Cybercode EduLabs' official AI Advisor & Career Mentor.

Your job:
- Provide accurate, realistic roadmaps, plans, and suggestions
- Use Cybercode EduLabs courses only (from courseContext)
- Personalize based on persona, stats, goals
- Motivate the learner at the end
- Always return clean, readable plain text

USER GOALS:
${JSON.stringify(userGoals || {}, null, 2)}

USER STATS:
${JSON.stringify(userStats || {}, null, 2)}

PERSONA SCORES:
${JSON.stringify(personaScores || {}, null, 2)}

COURSES (trimmed for context):
${(courseContext || "").substring(0, 20000)}
`;

    // ---- CONVERSATION HISTORY ----
    const groqMessages = [
      { role: "system", content: systemPrompt },

      ...messages.map((m) => ({
        role: m.role || (m.from === "user" ? "user" : "assistant"),
        content: m.content || m.text || "",
      })),

      { role: "user", content: prompt || "No question provided." },
    ];

    // ---- REQUEST BODY ----
    const requestBody = {
      model,
      messages: groqMessages,
      temperature: 0.2,
      max_tokens: 1500,
    };

    // ---- SEND REQUEST ----
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    let data;
    try {
      data = await res.json();
    } catch (e) {
      console.error("Failed parsing Groq response:", e);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Invalid response from Groq API." }),
      };
    }

    if (!res.ok) {
      console.error("Groq API returned error:", data);
      return {
        statusCode: res.status || 500,
        body: JSON.stringify({
          error: data?.error?.message || "Groq API request failed.",
          raw: data,
        }),
      };
    }

    // ---- EXTRACT TEXT (handles all Groq formats) ----
    let outText = null;

    try {
      const choice = data?.choices?.[0];

      if (choice?.message?.content) {
        outText = choice.message.content;
      } else if (choice?.text) {
        outText = choice.text;
      } else if (Array.isArray(choice?.message?.content)) {
        outText = choice.message.content
          .map((c) => c.text || c.content || "")
          .join("\n");
      } else if (data.output) {
        outText = data.output
          .map((o) =>
            typeof o === "string"
              ? o
              : o.text ||
                o.content ||
                (Array.isArray(o.content)
                  ? o.content.map((x) => x.text || "").join("")
                  : "") ||
                JSON.stringify(o)
          )
          .join("\n\n");
      }
    } catch (err) {
      console.warn("Error extracting model output:", err);
    }

    // Fallback
    if (!outText) {
      outText = JSON.stringify(data).slice(0, 20000);
    }

    // ---- Return in OpenAI-like format (frontend compatibility) ----
    const result = {
      choices: [
        {
          message: {
            content: outText,
          },
        },
      ],
      raw: data,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
