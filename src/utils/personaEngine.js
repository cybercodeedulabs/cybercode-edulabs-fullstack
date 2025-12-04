// src/utils/personaEngine.js

export const PERSONAS_LIST = {
  security: "Security",
  developer: "Developer",
  cloud: "Cloud Engineer",
  data: "Data Scientist",
  devops: "DevOps Engineer",
  networking: "Network Engineer",
  beginner: "Beginner",
};

/* ----------------------------------------
   Infer persona from lesson or course title
----------------------------------------- */
export function inferPersonaFromTitle(title = "") {
  const t = (title || "").toLowerCase();

  if (/\b(security|cyber|forensics|siem|ids|ips|vulnerability|incident|threat)\b/.test(t))
    return "security";

  if (/\b(devops|docker|kubernetes|ci\/cd|pipeline|cicd|terraform|iac)\b/.test(t))
    return "devops";

  if (/\b(aws|azure|gcp|cloud|private cloud|openstack|ec2|s3)\b/.test(t))
    return "cloud";

  if (/\b(data|ml|machine learning|pandas|numpy|scikit|ai|model)\b/.test(t))
    return "data";

  if (/\b(network|tcp|packet|routing|ccna|switch|router)\b/.test(t))
    return "networking";

  if (/\b(go|golang|python|java|javascript|node|react|full-stack|backend)\b/.test(t))
    return "developer";

  return "beginner";
}

/* ----------------------------------------
   Lesson-level Persona delta
----------------------------------------- */
export function quickLessonPersonaDelta(lesson = {}) {
  if (!lesson || !lesson.title) return {};
  const persona = inferPersonaFromTitle(lesson.title);
  const deltas = {};

  switch (persona) {
    case "security":
      deltas.security = 10;
      deltas.developer = 2;
      break;
    case "devops":
      deltas.devops = 10;
      deltas.cloud = 4;
      break;
    case "cloud":
      deltas.cloud = 10;
      deltas.devops = 4;
      break;
    case "data":
      deltas.data = 10;
      deltas.developer = 3;
      break;
    case "networking":
      deltas.networking = 10;
      deltas.security = 3;
      break;
    case "developer":
      deltas.developer = 10;
      deltas.cloud = 3;
      break;
    default:
      deltas.beginner = 6;
      deltas.developer = 2;
  }

  // boost project-related lessons
  if (/(project|capstone|mini project)/i.test(lesson.title || "")) {
    Object.keys(deltas).forEach((k) => (deltas[k] = Math.round(deltas[k] * 1.25)));
  }

  return deltas;
}

/* ----------------------------------------
   Course-level Persona delta
----------------------------------------- */
export function quickCoursePersonaDelta(course = {}) {
  if (!course) return {};
  const category = (course.category || "").toLowerCase();
  const title = course.title || "";

  if (/cloud|devops|infrastructure/.test(category)) {
    return { cloud: 12, devops: 8 };
  }
  if (/programming|development|web|full-stack|golang|python/.test(category)) {
    return { developer: 12 };
  }
  if (/data|ml|ai|science/.test(category)) {
    return { data: 12, developer: 4 };
  }
  if (/security|cyber|network|ccna/.test(category)) {
    return { security: 12, networking: 5 };
  }

  return quickLessonPersonaDelta({ title });
}

/* ----------------------------------------
   Normalize scores safely
----------------------------------------- */
export function normalizePersonaScores(scores = {}) {
  try {
    const entries = Object.entries(scores || {});
    if (!entries.length) return {};

    const max = Math.max(
      ...entries.map(([, v]) => Number(v || 0)),
      1
    );

    const normalized = {};
    entries.forEach(([k, v]) => {
      const raw = Number(v || 0);
      const pct = isNaN(raw) ? 0 : Math.round((raw / max) * 100);
      normalized[k] = pct;
    });

    return normalized;
  } catch (err) {
    console.warn("normalizePersonaScores failed:", err);
    return {};
  }
}

/* ----------------------------------------
   Top persona with safe fallback
----------------------------------------- */
export function topPersonaFromScores(scores = {}) {
  try {
    const entries = Object.entries(scores || {}).sort((a, b) => b[1] - a[1]);

    if (!entries.length) {
      return {
        persona: "beginner",
        score: 0,
        all: [["beginner", 0]],
      };
    }

    const [persona, score] = entries[0];

    return {
      persona: persona || "beginner",
      score: Number(score || 0),
      all: entries,
    };
  } catch (err) {
    console.warn("topPersonaFromScores failed:", err);
    return {
      persona: "beginner",
      score: 0,
      all: [["beginner", 0]],
    };
  }
}

export default {
  PERSONAS_LIST,
  inferPersonaFromTitle,
  quickLessonPersonaDelta,
  quickCoursePersonaDelta,
  normalizePersonaScores,
  topPersonaFromScores,
};
