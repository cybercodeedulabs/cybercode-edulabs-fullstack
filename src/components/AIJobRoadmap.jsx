// src/components/AIJobRoadmap.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const LOCAL_KEY_PREFIX = "cybercode_ai_roadmap_v1_";

export default function AIJobRoadmap({ goals }) {
  const { personaScores, userStats, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [error, setError] = useState(null);

  const cacheKey = user ? `${LOCAL_KEY_PREFIX}${user.uid}` : LOCAL_KEY_PREFIX + "anon";

  useEffect(() => {
    if (!goals) return;
    // check cache
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.ts && Date.now() - parsed.ts < 24 * 60 * 60 * 1000) {
          setAiText(parsed.text);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    fetchRoadmap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

  const fetchRoadmap = async () => {
    if (!goals) return;
    setLoading(true);
    setError(null);

    const userPrompt = `
Generate a concise, step-by-step career roadmap for the user. Use the user's goals and stats to:
1) Provide a 1-paragraph outcome summary.
2) Provide a month-by-month roadmap (months based on deadlineMonths).
3) Provide 3 recommended projects.
4) Suggest next 5 action items (courses/lessons with links).
Be realistic about timeline based on hoursPerWeek. Output clearly separated sections.
`;

    try {
      const resp = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          messages: [],
          courseContext: "",
          userGoals: goals,
          personaScores,
          userStats,
        }),
      });

      const data = await resp.json();
      const aiTextRaw = data.choices?.[0]?.message?.content || data.error || "AI did not return a roadmap.";
      setAiText(aiTextRaw);

      try {
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), text: aiTextRaw }));
      } catch (e) {}
    } catch (err) {
      console.error("AI roadmap error", err);
      setError("Unable to generate AI roadmap. Showing fallback.");
    } finally {
      setLoading(false);
    }
  };

  if (!goals) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-semibold text-gray-700">No goals yet</div>
        <div className="text-sm text-gray-500 mt-2">Set your goal to get a personalized AI roadmap.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="h-4 bg-gray-200 rounded w-3/5 mb-3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/5 mb-3 animate-pulse" />
        <div className="mt-6 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !aiText) {
    return (
      <div>
        <div className="text-sm text-red-500 mb-3">{error}</div>
        <div className="text-sm text-gray-600">We couldn't reach AI. Please try again later, or use the default roadmap below.</div>
      </div>
    );
  }

  const formatted = (aiText || "").split("\n\n").map((p, i) => {
    const html = (p || "").replace(/(https?:\/\/[^\s]+)/g, (m) => `<a href="${m}" target="_blank" rel="noreferrer" class="text-indigo-600 underline">${m}</a>`);
    return (<div key={i} className="mt-3 text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: html }} />);
  });

  return (
    <div>
      {formatted}
      <div className="mt-6">
        <button onClick={fetchRoadmap} className="px-4 py-2 bg-indigo-600 text-white rounded">Regenerate Roadmap</button>
        <button onClick={() => { localStorage.removeItem(cacheKey); fetchRoadmap(); }} className="ml-2 px-4 py-2 border rounded">Clear Cache & Regenerate</button>
      </div>
    </div>
  );
}
