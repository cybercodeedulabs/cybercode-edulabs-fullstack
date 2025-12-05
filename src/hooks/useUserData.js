// src/hooks/useUserData.js
// Local-only implementation while Firebase is disabled.
// Stores per-user data in localStorage under cc_userdoc_<uid>
// and goals in cc_goals_<uid>.

import { useEffect } from "react";

const USE_FIREBASE = false;

/** LocalStorage guard */
const canUseLocalStorage = () => {
  try {
    if (typeof window === "undefined") return false;
    if (!window.localStorage) return false;
    // some browsers throw when accessing localStorage in certain modes
    const testKey = "__cc_test__";
    try {
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
    } catch {
      // localStorage exists but inaccessible (privacy mode / blocked)
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/** safe parse helper */
const safeParse = (raw, fallback = null) => {
  try {
    if (raw === undefined || raw === null) return fallback;
    // if raw is already an object/array, return it
    if (typeof raw === "object") return raw;
    if (typeof raw !== "string") return fallback;
    if (raw.trim() === "") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

/** Safe wrappers for localStorage get/set that never throw up to callers */
const safeGetItem = (key, fallback = null) => {
  if (!canUseLocalStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return safeParse(raw, fallback);
  } catch {
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  if (!canUseLocalStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
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
    if (!uid) return null;
    try {
      const parsed = safeGetItem(userKey(uid), null);
      // ensure parsed is object or null
      if (parsed && typeof parsed === "object") return parsed;
      return null;
    } catch {
      return null;
    }
  };

  const writeUserDoc = (uid, obj) => {
    if (!uid || !obj || typeof obj !== "object") return;
    try {
      safeSetItem(userKey(uid), obj);
    } catch {
      // ignore
    }
  };

  const readGoalsDoc = (uid) => {
    if (!uid) return null;
    try {
      return safeGetItem(goalsKey(uid), null);
    } catch {
      return null;
    }
  };

  const writeGoalsDoc = (uid, obj) => {
    if (!uid || !obj || typeof obj !== "object") return;
    try {
      safeSetItem(goalsKey(uid), obj);
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

  /** Normalize userStats to a safe shape */
  const defaultUserStats = () => ({
    totalMinutes: 0,
    daily: {},
    streakDays: 0,
    longestStreak: 0,
    lastStudyDate: "",
    weeklyMinutes: 0,
    weeklyPct: 0,
    readinessPct: 0,
  });

  /** Normalize courseProgress entry */
  const normalizeCourseProgress = (cp) => {
    if (!cp || typeof cp !== "object") return {};
    const out = {};
    Object.keys(cp).forEach((k) => {
      const entry = cp[k] || {};
      out[k] = {
        completedLessons: Array.isArray(entry.completedLessons)
          ? entry.completedLessons
          : [],
        currentLessonIndex:
          typeof entry.currentLessonIndex === "number"
            ? entry.currentLessonIndex
            : (Array.isArray(entry.completedLessons) ? entry.completedLessons.length : 0),
        sessions: Array.isArray(entry.sessions) ? entry.sessions : [],
        timeSpentMinutes: typeof entry.timeSpentMinutes === "number" ? entry.timeSpentMinutes : 0,
        updatedAt: entry.updatedAt || null,
      };
    });
    return out;
  };

  /** Create initial structure if missing */
  const ensureInitialLocalDoc = () => {
    const existing = readUserDoc(uid) || {};

    const base = {
      enrolledCourses: Array.isArray(existing.enrolledCourses)
        ? existing.enrolledCourses
        : [],
      projects: Array.isArray(existing.projects) ? existing.projects : [],
      isPremium: Boolean(existing.isPremium),
      hasCertificationAccess: Boolean(existing.hasCertificationAccess),
      hasServerAccess: Boolean(existing.hasServerAccess),

      courseProgress: normalizeCourseProgress(existing.courseProgress),

      userStats:
        existing.userStats && typeof existing.userStats === "object"
          ? { ...defaultUserStats(), ...existing.userStats }
          : defaultUserStats(),

      generatedProjects: Array.isArray(existing.generatedProjects)
        ? existing.generatedProjects
        : [],

      updatedAt:
        existing.updatedAt && (typeof existing.updatedAt === "number" || typeof existing.updatedAt === "string")
          ? existing.updatedAt
          : nowTs(),
    };

    // Persist a normalized copy back (best-effort)
    try {
      safeSetItem(userKey(uid), base);
    } catch {
      // ignore
    }

    return base;
  };

  /** HYDRATE AFTER MOUNT */
  useEffect(() => {
    try {
      if (!canUseLocalStorage()) return;

      const doc = ensureInitialLocalDoc();

      setEnrolledCourses?.(
        Array.isArray(doc.enrolledCourses) ? doc.enrolledCourses : []
      );
      setCourseProgress?.(doc.courseProgress || {});
      setUserStats?.(doc.userStats || defaultUserStats());

      const g = readGoalsDoc(uid);
      if (g && typeof g === "object") setUserGoals?.(g);

      if (doc.isPremium && setUser) {
        setUser((u) => (u ? { ...u, isPremium: true } : u));
      }
    } catch (e) {
      console.warn("hydrateOnce failed", e);
    }
    // uid is stable
  }, [uid, setEnrolledCourses, setCourseProgress, setUser, setUserGoals, setUserStats]);

  /** Persist UI + localStorage together */
  const persistAndNotify = (nextDoc) => {
    try {
      if (!nextDoc || typeof nextDoc !== "object") return;
      // Ensure full shape before writing
      const safeNext = {
        enrolledCourses: Array.isArray(nextDoc.enrolledCourses)
          ? nextDoc.enrolledCourses
          : [],
        projects: Array.isArray(nextDoc.projects) ? nextDoc.projects : [],
        isPremium: Boolean(nextDoc.isPremium),
        hasCertificationAccess: Boolean(nextDoc.hasCertificationAccess),
        hasServerAccess: Boolean(nextDoc.hasServerAccess),
        courseProgress: normalizeCourseProgress(nextDoc.courseProgress),
        userStats:
          nextDoc.userStats && typeof nextDoc.userStats === "object"
            ? { ...defaultUserStats(), ...nextDoc.userStats }
            : defaultUserStats(),
        generatedProjects: Array.isArray(nextDoc.generatedProjects)
          ? nextDoc.generatedProjects
          : [],
        updatedAt: nextDoc.updatedAt || nowTs(),
      };

      writeUserDoc(uid, safeNext);
    } catch (e) {
      console.warn("persistAndNotify writeUserDoc failed", e);
    }

    // mirror generatedProjects to global key
    try {
      const gp = Array.isArray(nextDoc && nextDoc.generatedProjects) ? nextDoc.generatedProjects : [];
      safeSetItem("cybercode_generated_projects_v1", gp);
    } catch (e) {
      // ignore
    }

    // update react state via callbacks
    try {
      setEnrolledCourses?.(
        Array.isArray(nextDoc.enrolledCourses) ? nextDoc.enrolledCourses : []
      );
      setCourseProgress?.(nextDoc.courseProgress || {});
      setUserStats?.(nextDoc.userStats || defaultUserStats());
      setUser?.((u) => (u ? { ...u, isPremium: Boolean(nextDoc.isPremium) } : u));
    } catch (e) {
      console.warn("persistAndNotify state update failed", e);
    }
  };

  /* ============================
        LOCAL MODE FUNCTIONS
     ============================ */

  const enrollInCourse = async (courseSlug) => {
    const doc = ensureInitialLocalDoc();
    const arr = Array.isArray(doc.enrolledCourses) ? [...doc.enrolledCourses] : [];
    if (!arr.includes(courseSlug)) arr.push(courseSlug);

    persistAndNotify({
      ...doc,
      enrolledCourses: arr,
      updatedAt: nowTs(),
    });
  };

  const completeLessonFS = async (courseSlug, lessonSlug) => {
    const doc = ensureInitialLocalDoc();
    const cp = { ...(doc.courseProgress || {}) };

    const existing = cp[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
    const completed = Array.isArray(existing.completedLessons) ? [...existing.completedLessons] : [];
    if (!completed.includes(lessonSlug)) completed.push(lessonSlug);

    cp[courseSlug] = {
      ...existing,
      completedLessons: completed,
      currentLessonIndex: completed.length,
      updatedAt: nowTs(),
      sessions: Array.isArray(existing.sessions) ? existing.sessions : [],
      timeSpentMinutes: typeof existing.timeSpentMinutes === "number" ? existing.timeSpentMinutes : 0,
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
    const usrStats = { ...(doc.userStats || defaultUserStats()) };

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
    else if (last === yesterday)
      usrStats.streakDays = (usrStats.streakDays || 0) + 1;
    else usrStats.streakDays = 1;

    usrStats.longestStreak = Math.max(
      usrStats.longestStreak || 0,
      usrStats.streakDays
    );
    usrStats.lastStudyDate = today;

    // weekly aggregation
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
      usrStats.weeklyPct + (usrStats.streakDays || 0) * 3
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

    cp[courseSlug] = {
      ...course,
      completedLessons: Array.isArray(course.completedLessons) ? course.completedLessons : [],
      currentLessonIndex: typeof course.currentLessonIndex === "number" ? course.currentLessonIndex : (Array.isArray(course.completedLessons) ? course.completedLessons.length : 0),
    };

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
      userStats: defaultUserStats(),
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
    if (!goals || typeof goals !== "object") return;
    const payload = {
      ...goals,
      updatedAt: nowTs(),
      createdAt: goals.createdAt || nowTs(),
    };

    writeGoalsDoc(uid, payload);
    setUserGoals?.(payload);
    try {
      safeSetItem("cc_goals_" + uid, payload);
    } catch {}
  };

  const loadGeneratedProjects = async () => {
    try {
      const doc = ensureInitialLocalDoc();
      const list = Array.isArray(doc.generatedProjects)
        ? doc.generatedProjects
        : [];

      // mirror to global key too
      try {
        safeSetItem("cybercode_generated_projects_v1", list);
      } catch {}

      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error("loadGeneratedProjects failed", e);
      // fallback: try global key
      try {
        const parsed = safeGetItem("cybercode_generated_projects_v1", []);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
  };

  const saveGeneratedProject = async (project) => {
    try {
      if (!project || typeof project !== "object") return project;
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
        const arr = safeGetItem("cybercode_generated_projects_v1", []);
        const withId = { ...project, id: project.id || `${nowTs()}-${Math.random()}`, timestamp: nowTs() };
        const nextArr = Array.isArray(arr) ? [...arr, withId] : [withId];
        safeSetItem("cybercode_generated_projects_v1", nextArr);
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
