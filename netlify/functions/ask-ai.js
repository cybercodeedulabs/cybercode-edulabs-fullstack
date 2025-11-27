// netlify/functions/ask-ai.js
// Optimized GROQ backend with in-memory caching, per-user rate limiting,
// model routing (chat vs roadmap), retries, and graceful cache fallback.
// Requires GROQ_API_KEY in Netlify env. Optional envs: GROQ_MODEL_CHAT, GROQ_MODEL_ROADMAP,
// RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS, CACHE_TTL_MS

const crypto = require("crypto");

// --- Warm lambda globals (persist while lambda is warm) ---
const inMemoryCache = new Map(); // key -> { ts, value }
const userRequestLog = new Map(); // userKey -> [timestamps]
let lastGlobalCall = 0;

// Default config (can be tuned via env)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || "1500"); // window
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || "6"); // per window
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || String(24 * 60 * 60 * 1000)); // 24h

// helper: generate cache key
function hashPayload(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

// helper: identify user key (prefer user.uid, fallback to IP)
function userKeyFromEvent(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const maybeUser = body.user || {};
    if (maybeUser && maybeUser.uid) return `uid:${maybeUser.uid}`;
  } catch (e) {}
  // fallback to incoming header IPs
  const headers = event.headers || {};
  const ip =
    headers["x-nf-client-connection-ip"] ||
    headers["x-forwarded-for"] ||
    headers["x-real-ip"] ||
    headers["client-ip"] ||
    "anon";
  return `ip:${ip}`;
}

// sliding window check for a key
function allowRequestForKey(key) {
  const now = Date.now();
  const arr = userRequestLog.get(key) || [];
  // remove old timestamps
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const filtered = arr.filter((t) => t > cutoff);
  if (filtered.length >= RATE_LIMIT_MAX_REQUESTS) {
    // too many requests
    userRequestLog.set(key, filtered);
    return false;
  }
  // allow and append
  filtered.push(now);
  userRequestLog.set(key, filtered);
  return true;
}

// clean old cache entries occasionally
function cleanCache() {
  const now = Date.now();
  for (const [k, v] of inMemoryCache.entries()) {
    if (!v || !v.ts || now - v.ts > CACHE_TTL_MS) {
      inMemoryCache.delete(k);
    }
  }
}

// main handler
export async function handler(event) {
  try {
    const now = Date.now();

    // small global throttle (prevent tight bursts)
    if (now - lastGlobalCall < 300) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "Server busy. Please try again shortly." }),
      };
    }
    lastGlobalCall = now;

    // parse input
    const body = event.body ? JSON.parse(event.body) : {};
    const {
      prompt = "",
      messages = [],
      courseContext = "",
      userGoals = {},
      personaScores = {},
      userStats = {},
      mode = "chat", // required by frontend: "chat" | "roadmap"
      user: userFromClient = null, // optional full user object for caching key
    } = body;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return { statusCode: 500, body: JSON.stringify({ error: "Server misconfigured: Missing GROQ_API_KEY" }) };
    }

    // Compute user key for rate limiting
    const ukey = userFromClient && userFromClient.uid ? `uid:${userFromClient.uid}` : userKeyFromEvent(event);

    // check per-user rate limit
    if (!allowRequestForKey(ukey)) {
      return { statusCode: 429, body: JSON.stringify({ error: "Rate limit: too many requests. Slow down a bit." }) };
    }

    // Build trimmed conversation
    const trimmedMsgs = (messages || []).slice(-6).map((m) => ({
      role: m.role || (m.from === "user" ? "user" : "assistant"),
      content: (m.content || m.text || "").slice(0, 800),
    }));

    // Model routing based on explicit mode
    const chatModel = process.env.GROQ_MODEL_CHAT || "llama-3.2-3b-instant";
    const roadmapModel = process.env.GROQ_MODEL_ROADMAP || "llama-3.1-8b-instant";
    const model = mode === "roadmap" ? roadmapModel : chatModel;

    // token limits: larger for roadmap
    const maxTokens = mode === "roadmap" ? 900 : 400;
    const temperature = mode === "roadmap" ? 0.15 : 0.05;

    const systemPrompt = `
Cybercode EduLabs AI Advisor. Reply in concise markdown.

RULES:
- Short answers unless user requests deep detail.
- If user greets (hi/hello) reply briefly.
- Use courseContext for course questions.
- Use userGoals/persona/stats for roadmap requests.
- When unclear, ask for clarification.
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

    // Cache key
    const cacheKey = hashPayload(payloadForCache);

    // Check in-memory cache first
    const cached = inMemoryCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      // Return cached result quickly
      cleanCache();
      return {
        statusCode: 200,
        body: JSON.stringify({
          choices: [{ message: { content: cached.value } }],
          raw: { cached: true },
        }),
      };
    }

    // Build message list for Groq
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

    // attempt fetch with one retry on 429
    const doFetch = async () => {
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

    let result = await doFetch();
    if (!result.ok && result.status === 429) {
      // wait and retry once
      await new Promise((r) => setTimeout(r, 1000));
      result = await doFetch();
    }

    if (!result.ok) {
      // if failure, try graceful fallback from cache if available
      if (cached && cached.value) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            choices: [{ message: { content: cached.value } }],
            raw: { fallbackFromCache: true, error: result.data },
          }),
        };
      }
      return {
        statusCode: result.status || 502,
        body: JSON.stringify({ error: result.data?.error?.message || "Groq API failure", raw: result.data }),
      };
    }

    // Extract output
    const outText = (result.data?.choices?.[0]?.message?.content || "").replace(/\n{3,}/g, "\n\n").trim();

    // Save to in-memory cache
    try {
      inMemoryCache.set(cacheKey, { ts: Date.now(), value: outText });
    } catch (e) {
      // ignore cache set errors
    }

    // Periodically clean old cache
    if (Math.random() < 0.02) cleanCache();

    return {
      statusCode: 200,
      body: JSON.stringify({ choices: [{ message: { content: outText } }], raw: result.data }),
    };
  } catch (err) {
    console.error("ask-ai error", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error in ask-ai" }) };
  }
}
