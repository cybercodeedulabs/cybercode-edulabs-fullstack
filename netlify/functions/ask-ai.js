// netlify/functions/ask-ai.js
// Stable + optimized GROQ backend
// Features: model routing (chat / roadmap / project), caching, per-user rate-limit, retry,
// structured roadmap support, and FIXED project-mode JSON output.

const crypto = require("crypto");

// Warm lambda globals
const inMemoryCache = new Map();
const userRequestLog = new Map();
let lastGlobalCall = 0;

// Env defaults
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || "1500");
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || "6");
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || String(24 * 60 * 60 * 1000));

function hashPayload(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

function userKeyFromEvent(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    if (body.user?.uid) return `uid:${body.user.uid}`;
  } catch (_) { }

  const h = event.headers || {};
  return (
    h["x-nf-client-connection-ip"] ||
    h["x-forwarded-for"] ||
    h["x-real-ip"] ||
    h["client-ip"] ||
    "anon"
  );
}

function allowRequestForKey(key) {
  const now = Date.now();
  const arr = userRequestLog.get(key) || [];
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  const filtered = arr.filter((t) => t > cutoff);

  if (filtered.length >= RATE_LIMIT_MAX_REQUESTS) {
    userRequestLog.set(key, filtered);
    return false;
  }

  filtered.push(now);
  userRequestLog.set(key, filtered);
  return true;
}

function cleanCache() {
  const now = Date.now();
  for (const [k, v] of inMemoryCache.entries()) {
    if (!v || now - v.ts > CACHE_TTL_MS) {
      inMemoryCache.delete(k);
    }
  }
}

export async function handler(event) {
  try {
    const now = Date.now();

    // global burst throttle
    if (now - lastGlobalCall < 250) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "Server busy. Slow down briefly." }),
      };
    }
    lastGlobalCall = now;

    const body = event.body ? JSON.parse(event.body) : {};
    const {
      prompt = "",
      messages = [],
      courseContext = "",
      userGoals = {},
      personaScores = {},
      userStats = {},
      mode = "chat",
      user: clientUser = null,
      projectSpec = null,
      monthTitle,
      attackContext = null
    } = body;

    // check API key
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return { statusCode: 500, body: "Server missing API key" };
    }

    // Per-user limit
    const ukey = clientUser?.uid ? `uid:${clientUser.uid}` : userKeyFromEvent(event);
    if (!allowRequestForKey(ukey)) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "Too many requests. Try again shortly." }),
      };
    }

    // Trim messages
    const trimmedMsgs = (messages || []).slice(-6).map((m) => ({
      role: m.role || (m.from === "user" ? "user" : "assistant"),
      content: (m.content || m.text || "").slice(0, 800),
    }));

    // Model routing defaults
    const chatModel = process.env.GROQ_MODEL_CHAT || "llama-3.1-8b-instant";
    const roadmapModel = process.env.GROQ_MODEL_ROADMAP || "llama-3.1-70b-versatile";
    const projectModel = process.env.GROQ_MODEL_PROJECT || chatModel;

    let model = chatModel;
    let maxTokens = 400;
    let temperature = 0.05;

    if (mode === "roadmap") {
      model = roadmapModel;
      maxTokens = 950;
      temperature = 0.2;
    } else if (mode === "project") {
      model = projectModel;
      maxTokens = 700;
      temperature = 0.15;
    } else if (mode === "roadmap_explain") {        // ⭐ NEW MODE — Month Explanation
      model = roadmapModel;      // use the 70B model for consistency
      maxTokens = 300;           // explanations are short
      temperature = 0.2;
    } else if (mode === "attack_replay") {
      model = chatModel;
      maxTokens = 300;
      temperature = 0.2;
    }



    // SYSTEM PROMPTS
    const systemPrompt =
      mode === "roadmap"
        ? `
You are Cybercode EduLabs Roadmap Generator.

Return ONLY markdown with these exact sections:

## Outcome Summary

## Month-by-Month Roadmap

Generate BETWEEN 2 and 6 months depending on:
- deadlineMonths
- weekly hours
- current skills
- target role

For EACH month output in this format:

### Month <number> — <Short Technical Title>
- Week 1: <task>
- Week 2: <task>
- Week 3: <task>
- Week 4: <task>

Titles MUST be short, professional, and skill-based.  
Examples:  
“Cloud & Linux Foundations”, “DevOps & IAM Essentials”,  
“Backend API Engineering”, “Projects & Deployments”,  
“Security & Monitoring”, etc.

## Recommended Projects
- 3 bullet points

## Next 5 Action Items
- 5 bullet points

RULES:
- DO NOT use code blocks.
- DO NOT add any extra sections.
- DO NOT include explanations outside markdown.
- Month count MUST depend on the user's goals.
- If user has high weekly hours & long deadline → generate more months.
- If user has low hours or short deadline → generate fewer months.

USER GOALS:
${JSON.stringify(userGoals)}
USER PROFILE:
${JSON.stringify(userStats)}
        `.trim()

        // ⭐ ADDED FOR MONTH EXPLANATION
        : mode === "roadmap_explain"
          ? `
You are Cybercode EduLabs Roadmap Explainer.

Return ONLY clean markdown.
Explain the purpose, importance, and expected outcome of this month.
Keep it motivating, simple, and structured.
Do NOT repeat weekly tasks.
Do NOT exceed 120 words.

MONTH TITLE:
${monthTitle}

USER GOALS:
${JSON.stringify(userGoals)}
USER PROFILE:
${JSON.stringify(userStats)}
        `.trim()
          : mode === "attack_replay"
            ? `
You are DigitalFort AI — a cyber defense intelligence engine.

Analyze the given cyber attack phase and return a concise,
professional security insight in clean markdown.

Include:
- What the attacker is doing
- Why this behavior is risky
- What DigitalFort detects at this stage
- Likely MITRE ATT&CK techniques (IDs optional)
- Recommended defensive action

Keep it under 120 words.
No emojis.
No code blocks.

ATTACK CONTEXT:
${JSON.stringify(attackContext || {})}
  `.trim()

            : mode === "project"
              ? `
You are Cybercode EduLabs Project Generator.

Return ONLY VALID JSON.
NO markdown.
NO code fences.
NO headings.
NO explanations.
JSON ONLY.

Use EXACT structure:

{
  "title": "",
  "description": "",
  "tech_stack": [],
  "difficulty": "",
  "tasks": []
}

Rules:
- "difficulty" must be one of: "Beginner", "Intermediate", "Advanced".
- "tasks" must contain exactly 5 actionable tasks.
- "tech_stack" must be an array.

USER GOALS:
${JSON.stringify(userGoals)}

PROJECT_SPEC:
${JSON.stringify(projectSpec || {})}

USER_PROFILE:
${JSON.stringify(userStats)}
        `.trim()
              : `
You are Cybercode EduLabs AI Advisor.
Reply in clean markdown.
Be crisp unless deep detail is asked.
Use courseContext if relevant.
Use userGoals/persona/stats for guidance.
        `.trim();

    // Cache payload
    const payloadForCache = {
      model,
      systemPrompt,
      trimmedMsgs,
      prompt: (prompt || "").slice(0, 2000),
      courseContext: (courseContext || "").slice(0, 15000),
      userGoals,
      personaScores,
      userStats,
      mode,
      projectSpec,
      monthTitle: monthTitle || "",
      attackContext

    };

    const cacheKey = hashPayload(payloadForCache);

    // check cache
    const cached = inMemoryCache.get(cacheKey);
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      cleanCache();
      return {
        statusCode: 200,
        body: JSON.stringify({
          choices: [{ message: { content: cached.value } }],
          raw: { cached: true },
        }),
      };
    }

    // Build message array for Groq
    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...trimmedMsgs,
      { role: "user", content: payloadForCache.prompt },
    ];

    const requestBody = {
      model,
      messages: groqMessages,
      temperature,
      max_tokens: maxTokens,
      top_p: 0.95,
    };

    // Helper fetch
    const fetchGroq = async () => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    };

    let result = await fetchGroq();

    // soft retry on 429
    if (!result.ok && result.status === 429) {
      await new Promise((r) => setTimeout(r, 1100));
      result = await fetchGroq();
    }

    if (!result.ok) {
      if (cached?.value) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            choices: [{ message: { content: cached.value } }],
            raw: { fallbackFromCache: true, error: result.data },
          }),
        };
      }

      return {
        statusCode: result.status,
        body: JSON.stringify({ error: result.data?.error?.message || "AI error" }),
      };
    }

    const out = (result.data?.choices?.[0]?.message?.content || "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Save to cache
    inMemoryCache.set(cacheKey, { ts: now, value: out });
    if (Math.random() < 0.04) cleanCache();

    // Respond
    return {
      statusCode: 200,
      body: JSON.stringify({
        choices: [{ message: { content: out } }],
        raw: result.data,
      }),
    };
  } catch (err) {
    console.error("ask-ai exception:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server internal error" }) };
  }
}
