// src/api/content.js
// Content abstraction layer. Currently backed by local JS data files (courseData + lessons files).

import courseData from "../data/courseData";

// Helper: try to load lessons from the lessons folder by slug
function loadLessonModule(slug) {
  try {
    // Vite/Webpack can't import with dynamic string easily; but we can require relative files list
    const lessons = import.meta.glob("../data/lessons/*.js", { eager: true });
    // lessons keys are like '../data/lessons/golang.js'
    const key = Object.keys(lessons).find((k) => k.includes(`${slug}.js`));
    if (key) return lessons[key].default || lessons[key];
  } catch (e) {
    console.warn("loadLessonModule fallback", e);
  }
  return null;
}

// ✅ Get all courses
export function getCourses() {
  return Array.isArray(courseData) ? [...courseData] : [];
}

// ✅ Get a single course by slug
export function getCourseBySlug(slug) {
  if (!slug) return null;
  const course = courseData.find((c) => c.slug === slug);
  return course || null;
}

// ✅ Get lessons for a course
export function getLessonsForCourse(slug) {
  const module = loadLessonModule(slug);
  if (module && (Array.isArray(module) || module.default)) {
    return module.default || module;
  }

  try {
    // fallback: check global lessons map (if injected)
    const lessonsMap = window.__CYBERCODE_LESSONS__ || {};
    if (lessonsMap[slug]) return lessonsMap[slug];
  } catch (e) {
    // ignore
  }

  return [];
}
