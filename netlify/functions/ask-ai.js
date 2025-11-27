// netlify/functions/ask-ai.js
// Stable + optimized GROQ backend
// Features: model routing, caching, per-user rate-limit, retry, structured roadmap support.

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
  } catch {}

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

    // models
    const chatModel = process.env.GROQ_MODEL_CHAT || "llama-3.1-8b-instant";
    const roadmapModel = process.env.GROQ_MODEL_ROADMAP || "llama-3.1-70b-versatile";

    const model = mode === "roadmap" ? roadmapModel : chatModel;
    const maxTokens = mode === "roadmap" ? 950 : 400;
    const temperature = mode === "roadmap" ? 0.2 : 0.05;

    // Proper system prompts
    const systemPrompt =
      mode === "roadmap"
        ? `
You are Cybercode EduLabs Roadmap Generator.

Return ONLY markdown with these exact sections:

## Outcome Summary

## Month-by-Month Roadmap
Month 1
- Weekly learning bullets
Month 2
- Weekly bullets
Month 3
- Weekly bullets

## Recommended Projects
- 3 project bullets

## Next 5 Action Items
- bullets

Do NOT use code blocks. Do NOT add any text outside sections.
Use concise, structured formatting.

USER GOALS:
${JSON.stringify(userGoals)}
USER PROFILE:
${JSON.stringify(userStats)}
        `.trim()
        : `
You are Cybercode EduLabs AI Advisor.
Reply in clean markdown. Keep replies crisp unless user asks deep detail.
Use courseContext for course questions.
Use goals/persona/stats for guidance.
Ask for clarification when question unclear.
          `.trim();

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

    // Build message stack
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

    // perform fetch with retry
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

    inMemoryCache.set(cacheKey, { ts: now, value: out });
    if (Math.random() < 0.04) cleanCache();

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
