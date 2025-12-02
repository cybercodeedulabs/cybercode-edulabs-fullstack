// src/hooks/useUserData.js
// Local-only implementation for prototyping while Firestore quota is exhausted.
// Stores a simple "user document" in localStorage under key `cc_userdoc_<uid>`
// and goals under `cc_goals_<uid>`.
// Exposes the same functions used by the app.
import React from "react";

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

/**
 * Small guard for localStorage (prevents crashes during SSR / build)
 */
const canUseLocalStorage = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
  // If Firebase mode -> return safe no-op object (Firestore will handle in real mode)
  if (USE_FIREBASE) {
    return {
      enrollInCourse: async () => {},
      completeLessonFS: async () => {},
      recordStudySession: async () => {},
      resetMyProgress: async () => {},
      grantCertificationAccess: async () => {},
      grantServerAccess: async () => {},
      grantFullPremium: async () => {},
      saveUserGoals: async () => {},
      loadGeneratedProjects: async () => [],
      saveGeneratedProject: async (p) => p,
    };
  }

  // Local storage helper factories
  const userKey = (uid) => `cc_userdoc_${uid}`;
  const goalsKey = (uid) => `cc_goals_${uid}`;

  const nowTs = () => Date.now();

  // Safe read/write helpers
  const readUserDoc = (uid) => {
    if (!canUseLocalStorage()) return null;
    try {
      const raw = localStorage.getItem(userKey(uid));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("readUserDoc parse failed", e);
      return null;
    }
  };

  const writeUserDoc = (uid, obj) => {
    if (!canUseLocalStorage()) return;
    try {
      localStorage.setItem(userKey(uid), JSON.stringify(obj));
    } catch (e) {
      console.error("writeUserDoc failed", e);
    }
  };

  const readGoalsDoc = (uid) => {
    if (!canUseLocalStorage()) return null;
    try {
      const raw = localStorage.getItem(goalsKey(uid));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("readGoalsDoc parse failed", e);
      return null;
    }
  };

  const writeGoalsDoc = (uid, obj) => {
    if (!canUseLocalStorage()) return;
    try {
      localStorage.setItem(goalsKey(uid), JSON.stringify(obj));
    } catch (e) {
      console.error("writeGoalsDoc failed", e);
    }
  };

  // If no user -> return no-op functions (do NOT attempt localStorage I/O)
  if (!user || !user.uid) {
    return {
      enrollInCourse: async () => {},
      completeLessonFS: async () => {},
      recordStudySession: async () => {},
      resetMyProgress: async () => {},
      grantCertificationAccess: async () => {},
      grantServerAccess: async () => {},
      grantFullPremium: async () => {},
      saveUserGoals: async () => {},
      loadGeneratedProjects: async () => [],
      saveGeneratedProject: async (p) => p,
    };
  }

  const uid = user.uid;

  // Ensure initial local doc exists for the given uid
  const ensureInitialLocalDoc = () => {
    const existing = readUserDoc(uid) || {};
    const base = {
      enrolledCourses: existing.enrolledCourses || [],
      projects: existing.projects || [],
      isPremium: existing.isPremium || false,
      hasCertificationAccess: existing.hasCertificationAccess || false,
      hasServerAccess: existing.hasServerAccess || false,
      courseProgress: existing.courseProgress || {},
      userStats: existing.userStats || {
        totalMinutes: 0,
        daily: {},
        streakDays: 0,
        longestStreak: 0,
        lastStudyDate: "",
        weeklyMinutes: 0,
        weeklyPct: 0,
        readinessPct: 0,
      },
      generatedProjects: existing.generatedProjects || [],
      updatedAt: existing.updatedAt || nowTs(),
    };
    // Write back a normalized doc (only if localStorage available)
    writeUserDoc(uid, base);
    return base;
  };

  // Hydrate UI (guarded: only run when localStorage available)
  try {
    if (canUseLocalStorage()) {
      const doc = ensureInitialLocalDoc();
      setEnrolledCourses?.(doc.enrolledCourses || []);
      setCourseProgress?.(doc.courseProgress || {});
      const g = readGoalsDoc(uid);
      if (g && setUserGoals) setUserGoals(g);
      if (doc.isPremium && setUser)
        setUser((u) => (u ? { ...u, isPremium: true } : u));
    }
  } catch (e) {
    console.warn("hydrateOnce failed", e);
  }

  // Write helper that persists doc and updates React state
  const persistAndNotify = (nextDoc) => {
    try {
      writeUserDoc(uid, nextDoc);
    } catch (e) {
      console.warn("persistAndNotify write failed", e);
    }
    try {
      setEnrolledCourses?.(nextDoc.enrolledCourses || []);
      setCourseProgress?.(nextDoc.courseProgress || {});
      setUser?.((u) => (u ? { ...u, isPremium: nextDoc.isPremium } : u));
    } catch (e) {
      console.warn("persistAndNotify state update failed", e);
    }
  };

  /* ============================
     Local-only methods
     ============================ */

  const enrollInCourse = async (courseSlug) => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      const nextEnrolled = Array.isArray(doc.enrolledCourses) ? [...doc.enrolledCourses] : [];
      if (!nextEnrolled.includes(courseSlug)) nextEnrolled.push(courseSlug);
      persistAndNotify({
        ...doc,
        enrolledCourses: nextEnrolled,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("enrollInCourse failed", e);
    }
  };

  const completeLessonFS = async (courseSlug, lessonSlug) => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      const cp = { ...(doc.courseProgress || {}) };
      const existing = cp[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
      const set = new Set(existing.completedLessons || []);
      set.add(lessonSlug);
      const completedLessons = Array.from(set);
      cp[courseSlug] = {
        ...existing,
        completedLessons,
        currentLessonIndex: completedLessons.length,
        updatedAt: nowTs(),
      };
      persistAndNotify({
        ...doc,
        courseProgress: cp,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("completeLessonFS failed", e);
    }
  };

  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    try {
      if (!minutes || minutes <= 0) return;
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      const usrStats = { ...(doc.userStats || {}) };
      const today = new Date().toISOString().split("T")[0];
      usrStats.daily = { ...(usrStats.daily || {}) };
      usrStats.daily[today] = (usrStats.daily[today] || 0) + minutes;
      usrStats.totalMinutes = (usrStats.totalMinutes || 0) + minutes;

      // streak logic
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
      })();
      const lastStudyDate = usrStats.lastStudyDate || "";
      let oldStreak = Number(usrStats.streakDays || 0);
      let newStreak = oldStreak;
      if (lastStudyDate === today) newStreak = oldStreak || 1;
      else if (lastStudyDate === yesterday) newStreak = (oldStreak || 0) + 1;
      else newStreak = 1;
      usrStats.lastStudyDate = today;
      usrStats.streakDays = newStreak;
      usrStats.longestStreak = Math.max(usrStats.longestStreak || 0, newStreak);

      // weekly logic
      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7.push(d.toISOString().split("T")[0]);
      }
      const weeklyMinutes = last7.reduce((sum, d) => sum + Number(usrStats.daily[d] || 0), 0);
      usrStats.weeklyMinutes = weeklyMinutes;

      const goals = readGoalsDoc(uid) || {};
      const hoursPerWeek = Number(goals.hoursPerWeek || 2);
      const weeklyGoal = hoursPerWeek * 60;
      usrStats.weeklyPct = weeklyGoal > 0 ? Math.round((weeklyMinutes / weeklyGoal) * 100) : 0;

      const streakFactor = Math.min(40, newStreak * 3);
      const weeklyFactor = Math.min(50, Math.round((weeklyMinutes / Math.max(1, weeklyGoal)) * 50));
      usrStats.readinessPct = Math.min(100, streakFactor + weeklyFactor);

      const cp = { ...(doc.courseProgress || {}) };
      const course = cp[courseSlug] || {
        timeSpentMinutes: 0,
        sessions: [],
        completedLessons: [],
        currentLessonIndex: 0,
      };
      course.timeSpentMinutes = (course.timeSpentMinutes || 0) + minutes;
      course.sessions = Array.isArray(course.sessions) ? [...course.sessions] : [];
      course.sessions.push({
        lesson: lessonSlug,
        minutes,
        ts: nowTs(),
      });
      cp[courseSlug] = course;

      persistAndNotify({
        ...doc,
        userStats: usrStats,
        courseProgress: cp,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("recordStudySession failed", e);
    }
  };

  const resetMyProgress = async () => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      persistAndNotify({
        ...doc,
        courseProgress: {},
        userStats: {
          totalMinutes: 0,
          daily: {},
          streakDays: 0,
          longestStreak: 0,
          lastStudyDate: "",
          weeklyMinutes: 0,
          weeklyPct: 0,
          readinessPct: 0,
        },
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("resetMyProgress failed", e);
    }
  };

  const grantCertificationAccess = async () => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      persistAndNotify({
        ...doc,
        hasCertificationAccess: true,
        isPremium: true,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("grantCertificationAccess failed", e);
    }
  };

  const grantServerAccess = async () => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      persistAndNotify({
        ...doc,
        hasServerAccess: true,
        isPremium: true,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("grantServerAccess failed", e);
    }
  };

  const grantFullPremium = async () => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      persistAndNotify({
        ...doc,
        isPremium: true,
        hasCertificationAccess: true,
        hasServerAccess: true,
        updatedAt: nowTs(),
      });
    } catch (e) {
      console.error("grantFullPremium failed", e);
    }
  };

  const saveUserGoals = async (goals) => {
    try {
      const now = nowTs();
      const payload = {
        ...goals,
        updatedAt: now,
        createdAt: goals.createdAt || now,
      };
      writeGoalsDoc(uid, payload);
      setUserGoals?.(payload);
    } catch (e) {
      console.error("saveUserGoals failed", e);
    }
  };

  // generated projects
  const loadGeneratedProjects = async () => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      return doc.generatedProjects || [];
    } catch (e) {
      console.error("loadGeneratedProjects failed", e);
      return [];
    }
  };

  const saveGeneratedProject = async (project) => {
    try {
      const doc = readUserDoc(uid) || ensureInitialLocalDoc();
      const gp = Array.isArray(doc.generatedProjects) ? [...doc.generatedProjects] : [];
      const withId = {
        ...project,
        id: project.id || `${nowTs()}-${Math.random()}`,
        timestamp: nowTs(),
      };
      gp.push(withId);
      persistAndNotify({
        ...doc,
        generatedProjects: gp,
        updatedAt: nowTs(),
      });
      return withId;
    } catch (e) {
      console.error("saveGeneratedProject failed", e);
      return project;
    }
  };

  // Public API (matches the original shape)
  return {
    enrollInCourse,
    completeLessonFS,
    recordStudySession,
    resetMyProgress,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
    saveUserGoals,
    loadGeneratedProjects,
    saveGeneratedProject,
  };
}
