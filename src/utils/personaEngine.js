// src/utils/personaEngine.js
// Simple rule-based persona engine. Easy to extend.

const PERSONAS = {
  developer: "Developer",
  devops: "DevOps",
  security: "Security",
  networking: "Networking",
  data: "Data Science",
};

const categoryPersonaMap = {
  "Programming & Development": { persona: "developer", score: 5 },
  "Cloud & DevOps": { persona: "devops", score: 6 },
  "Data Science & AI": { persona: "data", score: 6 },
  "Networking & Security": { persona: "security", score: 5 },
  "Hands-on Labs & Practice": { persona: "devops", score: 3 },
  // add more mappings if you have custom categories
};

// Optional tag-based boosts (lesson-level)
const tagPersonaMap = {
  docker: { persona: "devops", score: 4 },
  kubernetes: { persona: "devops", score: 5 },
  terraform: { persona: "devops", score: 5 },
  golang: { persona: "developer", score: 4 },
  python: { persona: "developer", score: 3 },
  ml: { persona: "data", score: 5 },
  security: { persona: "security", score: 5 },
  cisco: { persona: "networking", score: 4 },
  // add tags you use in lessons
};

export function quickCoursePersonaDelta(course) {
  // course expected to have category and optional tags array
  const deltas = {};
  const cat = course?.category;
  if (cat && categoryPersonaMap[cat]) {
    const p = categoryPersonaMap[cat];
    deltas[p.persona] = (deltas[p.persona] || 0) + p.score;
  }
  // also process course-level tags if present
  (course?.tags || []).forEach((t) => {
    const key = (t || "").toLowerCase();
    if (tagPersonaMap[key]) {
      const p = tagPersonaMap[key];
      deltas[p.persona] = (deltas[p.persona] || 0) + p.score;
    }
  });
  return deltas; // { developer: 5, devops: 3 }
}

export function quickLessonPersonaDelta(lesson) {
  // lesson: expected to have tags: ['docker','kubernetes'] or type/topic
  const deltas = {};
  (lesson?.tags || []).forEach((t) => {
    const key = (t || "").toLowerCase();
    if (tagPersonaMap[key]) {
      const p = tagPersonaMap[key];
      deltas[p.persona] = (deltas[p.persona] || 0) + p.score;
    }
  });
  return deltas;
}

export const PERSONAS_LIST = PERSONAS;
