// src/utils/personaEngine.js
/**
 * Lightweight persona utilities.
 *
 * - PERSONAS_LIST: friendly names
 * - inferPersonaFromTitle: conservative rule-based heuristics
 * - quickLessonPersonaDelta(lesson): returns small score deltas for persona scoring
 * - quickCoursePersonaDelta(course): similar but uses course metadata
 * - normalizePersonaScores(scores): convert raw scores to 0-100 normalized percentages
 * - topPersonaFromScores(scores): returns { persona, score, all: [[p,score], ...] }
 *
 * These are intentionally simple and explainable; you can replace them later with an AI model
 * or server side logic when you want more sophisticated mapping.
 */

export const PERSONAS_LIST = {
  security: "Security",
  developer: "Developer",
  cloud: "Cloud Engineer",
  data: "Data Scientist",
  devops: "DevOps Engineer",
  networking: "Network Engineer",
  beginner: "Beginner",
};

export function inferPersonaFromTitle(title = "") {
  const t = (title || "").toLowerCase();

  if (/\b(security|cyber|forensics|siem|ids|ips|vulnerability|incident|threat)\b/.test(t)) return "security";
  if (/\b(devops|docker|kubernetes|ci\/cd|pipeline|cicd|terraform|iac)\b/.test(t)) return "devops";
  if (/\b(aws|azure|gcp|cloud|private cloud|openstack|ec2|s3)\b/.test(t)) return "cloud";
  if (/\b(data|ml|machine learning|pandas|numpy|scikit|ai|model)\b/.test(t)) return "data";
  if (/\b(network|tcp|packet|routing|ccna|switch|router)\b/.test(t)) return "networking";
  if (/\b(go|golang|python|java|javascript|node|react|full-stack|backend)\b/.test(t)) return "developer";

  return "beginner";
}

/**
 * quickLessonPersonaDelta
 * Returns a small "delta" object like { security: 10, developer: 2 }
 * based on conservative keyword matching on lesson.title and lesson.content (if present).
 */
export function quickLessonPersonaDelta(lesson = {}) {
  if (!lesson || !lesson.title) return {};

  const persona = inferPersonaFromTitle(lesson.title);
  const deltas = {};

  // Base values tuned to be modest (so it accumulates gradually)
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

  // small boost if title has "project" or "capstone"
  if (/(project|capstone|mini project)/i.test(lesson.title || "")) {
    Object.keys(deltas).forEach((k) => (deltas[k] = Math.round(deltas[k] * 1.25)));
  }

  return deltas;
}

/**
 * quickCoursePersonaDelta
 * Accepts a course object (course.title, course.category) and returns persona deltas
 */
export function quickCoursePersonaDelta(course = {}) {
  if (!course) return {};
  const title = course.title || "";
  const category = (course.category || "").toLowerCase();

  // category-based strong signal
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

  // fallback: infer from title
  return quickLessonPersonaDelta({ title });
}

/**
 * normalizePersonaScores(scores)
 * Input: { security: 75, developer: 30, ... } (raw numbers)
 * Output: { security: 100, developer: 40, ... } normalized to 0-100 scale
 * Normalization preserves proportions (divides by max).
 */
export function normalizePersonaScores(scores = {}) {
  const entries = Object.entries(scores || {});
  if (!entries.length) return {};
  const max = Math.max(...entries.map(([, v]) => Number(v || 0)), 1);
  const normalized = {};
  entries.forEach(([k, v]) => {
    const pct = Math.round((Number(v || 0) / max) * 100);
    normalized[k] = pct;
  });
  return normalized;
}

/**
 * topPersonaFromScores(scores)
 * returns { persona: 'security', score: 75, all: [['security',75], ...] }
 */
export function topPersonaFromScores(scores = {}) {
  const entries = Object.entries(scores || {}).sort((a, b) => b[1] - a[1]);
  const top = entries[0] || [null, 0];
  return {
    persona: top[0],
    score: top[1],
    all: entries,
  };
}

export default {
  PERSONAS_LIST,
  inferPersonaFromTitle,
  quickLessonPersonaDelta,
  quickCoursePersonaDelta,
  normalizePersonaScores,
  topPersonaFromScores,
};
