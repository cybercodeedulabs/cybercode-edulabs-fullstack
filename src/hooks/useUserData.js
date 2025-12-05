// src/hooks/useUserData.js
// Local-only implementation while Firebase is disabled.
// Stores per-user data in localStorage under cc_userdoc_<uid>
// and goals in cc_goals_<uid>.

import { useEffect } from "react";

const USE_FIREBASE = false;

/** LocalStorage guard */
const canUseLocalStorage = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};

/** safe parse helper */
const safeParse = (raw, fallback = null) => {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals, setUserStats }
) {
  // If we ever re-enable Firebase, this branch will be swapped out.
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

  const userKey = (uid) => `cc_userdoc_${uid}`;
  const goalsKey = (uid) => `cc_goals_${uid}`;
  const nowTs = () => Date.now();

  const readUserDoc = (uid) => {
    if (!canUseLocalStorage()) return null;
    try {
      const raw = localStorage.getItem(userKey(uid));
      const parsed = safeParse(raw, null);
      return parsed || null;
    } catch {
      return null;
    }
  };

  const writeUserDoc = (uid, obj) => {
    if (!canUseLocalStorage()) return;
    try {
      localStorage.setItem(userKey(uid), JSON.stringify(obj));
    } catch {
      // ignore
    }
  };

  const readGoalsDoc = (uid) => {
    if (!canUseLocalStorage()) return null;
    try {
      const raw = localStorage.getItem(goalsKey(uid));
      return safeParse(raw, null);
    } catch {
      return null;
    }
  };

  const writeGoalsDoc = (uid, obj) => {
    if (!canUseLocalStorage()) return;
    try {
      localStorage.setItem(goalsKey(uid), JSON.stringify(obj));
    } catch {
      // ignore
    }
  };

  /** Not logged in → return no-op implementations */
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

  /** Create initial structure if missing */
  const ensureInitialLocalDoc = () => {
    const existing = readUserDoc(uid) || {};

    const base = {
      enrolledCourses: Array.isArray(existing.enrolledCourses)
        ? existing.enrolledCourses
        : [],
      projects: Array.isArray(existing.projects) ? existing.projects : [],
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

      generatedProjects: Array.isArray(existing.generatedProjects)
        ? existing.generatedProjects
        : [],
      updatedAt: existing.updatedAt || nowTs(),
    };

    writeUserDoc(uid, base);
    return base;
  };

  /** HYDRATE AFTER MOUNT */
  useEffect(() => {
    try {
      if (!canUseLocalStorage()) return;

      const doc = ensureInitialLocalDoc();

      setEnrolledCourses?.(Array.isArray(doc.enrolledCourses) ? doc.enrolledCourses : []);
      setCourseProgress?.(doc.courseProgress || {});
      setUserStats?.(doc.userStats || {});

      const g = readGoalsDoc(uid);
      if (g) setUserGoals?.(g);

      if (doc.isPremium && setUser) {
        setUser((u) => (u ? { ...u, isPremium: true } : u));
      }
    } catch (e) {
      console.warn("hydrateOnce failed", e);
    }
    // uid is safe
  }, [uid]);

  /** Persist UI + localStorage together */
  const persistAndNotify = (nextDoc) => {
    try {
      writeUserDoc(uid, nextDoc);
    } catch (e) {
      console.warn("persistAndNotify writeUserDoc failed", e);
    }

    // mirror generatedProjects to global key
    try {
      if (Array.isArray(nextDoc.generatedProjects)) {
        try {
          localStorage.setItem(
            "cybercode_generated_projects_v1",
            JSON.stringify(nextDoc.generatedProjects)
          );
        } catch (err) {
          // non-fatal
        }
      } else {
        // ensure global key is at least an empty array, never leave it undefined or non-array
        try {
          localStorage.setItem("cybercode_generated_projects_v1", JSON.stringify([]));
        } catch {}
      }
    } catch (e) {
      // ignore
    }

    // update react state via callbacks
    try {
      setEnrolledCourses?.(Array.isArray(nextDoc.enrolledCourses) ? nextDoc.enrolledCourses : []);
      setCourseProgress?.(nextDoc.courseProgress || {});
      setUserStats?.(nextDoc.userStats || {});
      setUser?.((u) => (u ? { ...u, isPremium: nextDoc.isPremium } : u));
    } catch (e) {
      console.warn("persistAndNotify state update failed", e);
    }
  };

  /* ============================
        LOCAL MODE FUNCTIONS
     ============================ */

  const enrollInCourse = async (courseSlug) => {
    const doc = ensureInitialLocalDoc();
    const set = new Set(Array.isArray(doc.enrolledCourses) ? doc.enrolledCourses : []);
    set.add(courseSlug);

    persistAndNotify({
      ...doc,
      enrolledCourses: Array.from(set),
      updatedAt: nowTs(),
    });
  };

  const completeLessonFS = async (courseSlug, lessonSlug) => {
    const doc = ensureInitialLocalDoc();
    const cp = { ...(doc.courseProgress || {}) };

    const existing =
      cp[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
    const set = new Set(Array.isArray(existing.completedLessons) ? existing.completedLessons : []);
    set.add(lessonSlug);

    cp[courseSlug] = {
      ...existing,
      completedLessons: Array.from(set),
      currentLessonIndex: set.size,
      updatedAt: nowTs(),
    };

    persistAndNotify({
      ...doc,
      courseProgress: cp,
      updatedAt: nowTs(),
    });
  };

  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!minutes || minutes <= 0) return;

    const doc = ensureInitialLocalDoc();
    const usrStats = { ...(doc.userStats || {}) };

    const today = new Date().toISOString().split("T")[0];
    usrStats.daily = usrStats.daily || {};
    usrStats.daily[today] = (usrStats.daily[today] || 0) + minutes;
    usrStats.totalMinutes = (usrStats.totalMinutes || 0) + minutes;

    // streak logic
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    })();

    const last = usrStats.lastStudyDate || "";
    if (last === today) usrStats.streakDays = usrStats.streakDays || 1;
    else if (last === yesterday) usrStats.streakDays = (usrStats.streakDays || 0) + 1;
    else usrStats.streakDays = 1;

    usrStats.longestStreak = Math.max(
      usrStats.longestStreak || 0,
      usrStats.streakDays
    );
    usrStats.lastStudyDate = today;

    // weekly %
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }

    usrStats.weeklyMinutes = last7.reduce(
      (sum, d) => sum + (usrStats.daily[d] || 0),
      0
    );

    const goals = readGoalsDoc(uid) || {};
    const hrs = Number(goals.hoursPerWeek || 2);
    const wkGoal = hrs * 60;

    usrStats.weeklyPct = wkGoal
      ? Math.round((usrStats.weeklyMinutes / wkGoal) * 100)
      : 0;
    usrStats.readinessPct = Math.min(
      100,
      usrStats.weeklyPct + usrStats.streakDays * 3
    );

    // update course time
    const cp = { ...(doc.courseProgress || {}) };
    const course =
      cp[courseSlug] || {
        completedLessons: [],
        currentLessonIndex: 0,
        sessions: [],
        timeSpentMinutes: 0,
      };

    course.sessions = [
      ...(Array.isArray(course.sessions) ? course.sessions : []),
      { lesson: lessonSlug, minutes, ts: nowTs() },
    ];

    course.timeSpentMinutes = (course.timeSpentMinutes || 0) + minutes;

    cp[courseSlug] = course;

    persistAndNotify({
      ...doc,
      userStats: usrStats,
      courseProgress: cp,
      updatedAt: nowTs(),
    });
  };

  const resetMyProgress = async () => {
    const doc = ensureInitialLocalDoc();

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
  };

  const grantCertificationAccess = async () => {
    const doc = ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      hasCertificationAccess: true,
      isPremium: true,
      updatedAt: nowTs(),
    });
  };

  const grantServerAccess = async () => {
    const doc = ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      hasServerAccess: true,
      isPremium: true,
      updatedAt: nowTs(),
    });
  };

  const grantFullPremium = async () => {
    const doc = ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
      updatedAt: nowTs(),
    });
  };

  const saveUserGoals = async (goals) => {
    const payload = {
      ...goals,
      updatedAt: nowTs(),
      createdAt: goals.createdAt || nowTs(),
    };

    writeGoalsDoc(uid, payload);
    setUserGoals?.(payload);
    try {
      localStorage.setItem("cc_goals_" + uid, JSON.stringify(payload));
    } catch {}
  };

  const loadGeneratedProjects = async () => {
    try {
      const doc = ensureInitialLocalDoc();
      const list = Array.isArray(doc.generatedProjects) ? doc.generatedProjects : [];

      // mirror to global key too
      try {
        localStorage.setItem("cybercode_generated_projects_v1", JSON.stringify(list));
      } catch {}

      return list;
    } catch (e) {
      console.error("loadGeneratedProjects failed", e);
      // fallback: try global key
      try {
        const raw = localStorage.getItem("cybercode_generated_projects_v1");
        const parsed = safeParse(raw, []);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
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

      // Persist to per-user doc + mirror global key via persistAndNotify
      persistAndNotify({
        ...doc,
        generatedProjects: gp,
        updatedAt: nowTs(),
      });

      // Return the saved project for caller
      return withId;
    } catch (e) {
      console.error("saveGeneratedProject failed", e);

      // As last-resort fallback, add to the global key directly
      try {
        const raw = localStorage.getItem("cybercode_generated_projects_v1");
        const arr = safeParse(raw, []);
        const withId = { ...project, id: project.id || `${nowTs()}-${Math.random()}`, timestamp: nowTs() };
        const nextArr = Array.isArray(arr) ? [...arr, withId] : [withId];
        localStorage.setItem("cybercode_generated_projects_v1", JSON.stringify(nextArr));
        return withId;
      } catch {
        return project;
      }
    }
  };

  /** Public API */
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
