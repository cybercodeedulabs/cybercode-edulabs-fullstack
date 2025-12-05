// src/hooks/useUserData.js
// FINAL PURE VERSION — No Firebase, No Flags, 100% Local Mode
// Stable, Postgres-ready, Crash-proof

import { useEffect, useRef } from "react";

/* ---------------------------------------
   LocalStorage Safety Helpers
----------------------------------------*/
const canUseLocalStorage = () => {
  try {
    if (typeof window === "undefined") return false;
    if (!window.localStorage) return false;
    const t = "__cc_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
};

const safeParse = (raw, fallback = null) => {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const safeGetItem = (key, fallback = null) => {
  if (!canUseLocalStorage()) return fallback;
  try {
    return safeParse(window.localStorage.getItem(key), fallback);
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

/* ---------------------------------------
   Key Helpers
----------------------------------------*/
const userKey = (uid) => `cc_userdoc_${uid}`;
const goalsKey = (uid) => `cc_goals_${uid}`;
const globalGeneratedKey = "cybercode_generated_projects_v1";
const nowTs = () => Date.now();

/* ---------------------------------------
   Default User Stats
----------------------------------------*/
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

const isPlainObject = (v) =>
  v !== null &&
  typeof v === "object" &&
  Object.prototype.toString.call(v) === "[object Object]";

/* ---------------------------------------
   Normalize course progress structure
----------------------------------------*/
const normalizeCourseProgress = (cp) => {
  try {
    if (!isPlainObject(cp)) return {};

    const out = {};

    for (const courseSlug of Object.keys(cp)) {
      const entry = cp[courseSlug];

      if (!isPlainObject(entry)) {
        out[courseSlug] = {
          completedLessons: [],
          currentLessonIndex: 0,
          sessions: [],
          timeSpentMinutes: 0,
          updatedAt: null,
        };
        continue;
      }

      const completed = Array.isArray(entry.completedLessons)
        ? entry.completedLessons
        : [];

      out[courseSlug] = {
        completedLessons: completed,
        currentLessonIndex:
          typeof entry.currentLessonIndex === "number"
            ? entry.currentLessonIndex
            : completed.length,
        sessions: Array.isArray(entry.sessions) ? entry.sessions : [],
        timeSpentMinutes:
          typeof entry.timeSpentMinutes === "number"
            ? entry.timeSpentMinutes
            : 0,
        updatedAt: entry.updatedAt || null,
      };
    }

    return out;
  } catch {
    return {};
  }
};

/* ---------------------------------------
   CRUD: User Docs & Goal Docs
----------------------------------------*/
const readUserDoc = (uid) => {
  if (!uid) return null;
  const doc = safeGetItem(userKey(uid), null);
  return isPlainObject(doc) ? doc : null;
};

const writeUserDoc = (uid, obj) => {
  if (!uid || !isPlainObject(obj)) return;
  safeSetItem(userKey(uid), obj);
};

const readGoalsDoc = (uid) =>
  uid ? safeGetItem(goalsKey(uid), null) : null;

const writeGoalsDoc = (uid, obj) => {
  if (!uid || !isPlainObject(obj)) return;
  safeSetItem(goalsKey(uid), obj);
};

/* ---------------------------------------
   MAIN HOOK: useUserData
----------------------------------------*/
export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals, setUserStats } = {}
) {
  // uid stored in ref → avoids stale closures
  const uidRef = useRef(user?.uid ?? null);
  uidRef.current = user?.uid ?? null;

  /* ---------------------------------------
     Ensure initial user doc exists
  ----------------------------------------*/
  const ensureDoc = (uid) => {
    if (!uid) return null;

    const existing = readUserDoc(uid) || {};

    const doc = {
      enrolledCourses: Array.isArray(existing.enrolledCourses)
        ? existing.enrolledCourses
        : [],
      projects: Array.isArray(existing.projects) ? existing.projects : [],
      isPremium: Boolean(existing.isPremium),
      hasCertificationAccess: Boolean(existing.hasCertificationAccess),
      hasServerAccess: Boolean(existing.hasServerAccess),
      courseProgress: normalizeCourseProgress(existing.courseProgress),
      userStats: isPlainObject(existing.userStats)
        ? { ...defaultUserStats(), ...existing.userStats }
        : defaultUserStats(),
      generatedProjects: Array.isArray(existing.generatedProjects)
        ? existing.generatedProjects
        : [],
      updatedAt:
        typeof existing.updatedAt === "number" ||
        typeof existing.updatedAt === "string"
          ? existing.updatedAt
          : nowTs(),
    };

    writeUserDoc(uid, doc);
    return doc;
  };

  /* ---------------------------------------
     HYDRATION EFFECT (runs when user.uid changes)
  ----------------------------------------*/
  useEffect(() => {
    const uid = uidRef.current;
    if (!uid || !canUseLocalStorage()) return;

    try {
      const doc = ensureDoc(uid);

      setEnrolledCourses?.(
        Array.isArray(doc.enrolledCourses) ? doc.enrolledCourses : []
      );
      setCourseProgress?.(doc.courseProgress || {});
      setUserStats?.(doc.userStats || defaultUserStats());

      const g = readGoalsDoc(uid);
      if (g && typeof g === "object") setUserGoals?.(g);

      if (doc.isPremium) {
        setUser?.((u) => (u ? { ...u, isPremium: true } : u));
      }
    } catch (err) {
      console.error("hydrate error in useUserData:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  /* ---------------------------------------
     Persist & Notify
  ----------------------------------------*/
  const persist = (uid, nextDoc) => {
    if (!uid || !isPlainObject(nextDoc)) return;

    const normalized = {
      ...nextDoc,
      courseProgress: normalizeCourseProgress(nextDoc.courseProgress),
      userStats: isPlainObject(nextDoc.userStats)
        ? { ...defaultUserStats(), ...nextDoc.userStats }
        : defaultUserStats(),
      updatedAt: nowTs(),
    };

    writeUserDoc(uid, normalized);

    safeSetItem(
      globalGeneratedKey,
      Array.isArray(normalized.generatedProjects)
        ? normalized.generatedProjects
        : []
    );

    setEnrolledCourses?.(normalized.enrolledCourses);
    setCourseProgress?.(normalized.courseProgress);
    setUserStats?.(normalized.userStats);
    setUser?.((u) => (u ? { ...u, isPremium: normalized.isPremium } : u));
  };

  /* ---------------------------------------
     ALL PUBLIC API (LOCAL IMPLEMENTATION)
     (Each one no-ops safely if no uid)
  ----------------------------------------*/
  const enrollInCourse = async (slug) => {
    const uid = uidRef.current;
    if (!uid) return;

    const doc = ensureDoc(uid);
    const list = new Set(doc.enrolledCourses || []);
    list.add(slug);

    persist(uid, { ...doc, enrolledCourses: [...list] });
  };

  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!minutes || minutes <= 0) return;
    const uid = uidRef.current;
    if (!uid) return;

    const doc = ensureDoc(uid);
    const stats = { ...(doc.userStats || defaultUserStats()) };
    const today = new Date().toISOString().split("T")[0];

    stats.daily = stats.daily || {};
    stats.daily[today] = (stats.daily[today] || 0) + minutes;
    stats.totalMinutes = (stats.totalMinutes || 0) + minutes;

    // streak logic
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    })();

    if (stats.lastStudyDate === today) stats.streakDays ||= 1;
    else if (stats.lastStudyDate === yesterday)
      stats.streakDays = (stats.streakDays || 0) + 1;
    else stats.streakDays = 1;

    stats.lastStudyDate = today;
    stats.longestStreak = Math.max(stats.longestStreak || 0, stats.streakDays);

    // weekly calculations
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    stats.weeklyMinutes = days.reduce(
      (sum, d) => sum + (stats.daily[d] || 0),
      0
    );

    const goals = readGoalsDoc(uid) || {};
    const hrs = Number(goals.hoursPerWeek || 2);
    const wkGoal = hrs * 60;

    stats.weeklyPct = wkGoal
      ? Math.round((stats.weeklyMinutes / wkGoal) * 100)
      : 0;

    stats.readinessPct = Math.min(
      100,
      stats.weeklyPct + stats.streakDays * 3
    );

    const cp = { ...(doc.courseProgress || {}) };
    const entry =
      cp[courseSlug] ||
      {
        completedLessons: [],
        currentLessonIndex: 0,
        sessions: [],
        timeSpentMinutes: 0,
      };

    entry.sessions = [
      ...(entry.sessions || []),
      { lesson: lessonSlug, minutes, ts: nowTs() },
    ];

    entry.timeSpentMinutes = (entry.timeSpentMinutes || 0) + minutes;

    cp[courseSlug] = {
      ...entry,
      currentLessonIndex: Array.isArray(entry.completedLessons)
        ? entry.completedLessons.length
        : 0,
    };

    persist(uid, { ...doc, userStats: stats, courseProgress: cp });
  };

  const resetMyProgress = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const doc = ensureDoc(uid);

    persist(uid, {
      ...doc,
      courseProgress: {},
      userStats: defaultUserStats(),
    });
  };

  const grantCertificationAccess = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const doc = ensureDoc(uid);

    persist(uid, {
      ...doc,
      isPremium: true,
      hasCertificationAccess: true,
    });
  };

  const grantServerAccess = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const doc = ensureDoc(uid);

    persist(uid, {
      ...doc,
      isPremium: true,
      hasServerAccess: true,
    });
  };

  const grantFullPremium = async () => {
    const uid = uidRef.current;
    if (!uid) return;
    const doc = ensureDoc(uid);

    persist(uid, {
      ...doc,
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
    });
  };

  const saveUserGoals = async (goals) => {
    const uid = uidRef.current;
    if (!uid || !isPlainObject(goals)) return;

    const payload = {
      ...goals,
      updatedAt: nowTs(),
      createdAt: goals.createdAt || nowTs(),
    };

    writeGoalsDoc(uid, payload);
    setUserGoals?.(payload);
  };

  const loadGeneratedProjects = async () => {
    const uid = uidRef.current;

    if (!uid) {
      const arr = safeGetItem(globalGeneratedKey, []);
      return Array.isArray(arr) ? arr : [];
    }

    const doc = ensureDoc(uid);
    const list = Array.isArray(doc.generatedProjects)
      ? doc.generatedProjects
      : [];

    safeSetItem(globalGeneratedKey, list);
    return list;
  };

  const saveGeneratedProject = async (project) => {
    if (!isPlainObject(project)) return project;

    const uid = uidRef.current;
    const id = project.id || `${nowTs()}-${Math.random()}`;

    const next = {
      ...project,
      id,
      timestamp: nowTs(),
    };

    if (!uid) {
      const arr = safeGetItem(globalGeneratedKey, []);
      const nextArr = Array.isArray(arr) ? [...arr, next] : [next];
      safeSetItem(globalGeneratedKey, nextArr);
      return next;
    }

    const doc = ensureDoc(uid);
    const gp = Array.isArray(doc.generatedProjects)
      ? [...doc.generatedProjects]
      : [];

    gp.push(next);

    persist(uid, {
      ...doc,
      generatedProjects: gp,
    });

    return next;
  };

  /* ---------------------------------------
     RETURN STABLE PUBLIC API
----------------------------------------*/
  return {
    enrollInCourse,
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
