// netlify/functions/ask-ai.js

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, messages, courseContext, userGoals, personaScores, userStats } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing OpenRouter API key");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server misconfigured: Missing API key." }),
      };
    }

    // Build a rich system prompt that includes user goals and stats
    const systemPrompt = `
You are Cybercode EduLabs' official AI Advisor + Career Mentor.
Use the course data below and the user's profile/goals to produce realistic, empathetic,
and actionable learning roadmaps, weekly study plans, project suggestions, and motivational guidance.
Always only recommend Cybercode EduLabs courses (use the course list) when recommending specific courses.

---- USER GOALS ----
${JSON.stringify(userGoals || {}, null, 2)}

---- USER STATS ----
${JSON.stringify(userStats || {}, null, 2)}

---- LEARNING PERSONA / SCORES ----
${JSON.stringify(personaScores || {}, null, 2)}

---- COURSE DATA ----
${courseContext}

Rules:
- Be realistic: match timeline to hours/week and skill gaps.
- Provide a short summary (1-2 lines), followed by a 6-step roadmap, weekly plan, and 3 suggested projects.
- Provide next-action CTA (which Cybercode course and which lesson to open next).
- Provide a short motivational message at the end.
- Return plain text; include URLs for courses (already present in courseContext).
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://cybercodeedulabs-platform.netlify.app",
        "X-Title": "Cybercode EduLabs AI Advisor",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
          { role: "user", content: prompt || "No question provided." },
        ],
        temperature: 0.2,
        max_tokens: 900,
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
