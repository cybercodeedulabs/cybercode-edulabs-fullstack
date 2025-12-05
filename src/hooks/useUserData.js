// src/hooks/useUserData.js
// Local-only implementation while Firebase is disabled.
// Stores per-user data in localStorage under cc_userdoc_<uid>
// and goals in cc_goals_<uid>.
//
// This version is hardened with defensive guards to avoid crashes
// when keys are missing or malformed in localStorage.

import { useEffect } from "react";

const USE_FIREBASE = false;

/** LocalStorage guard */
const canUseLocalStorage = () => {
  try {
    if (typeof window === "undefined") return false;
    if (!window.localStorage) return false;

    // Some browsers throw on access in private mode
    const testKey = "__cc_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
};

/** safe parse helper */
const safeParse = (raw, fallback = null) => {
  try {
    if (raw === undefined || raw === null) return fallback;
    if (typeof raw === "object") return raw;
    if (typeof raw !== "string") return fallback;
    if (raw.trim() === "") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

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

/**
 * useUserData
 *
 * This hook is intentionally defensive. Any unexpected internal error
 * will be caught and a no-op API will be returned so the app cannot
 * crash during hydration.
 */
export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals, setUserStats }
) {
  try {
    // No Firebase in this system anymore
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

    const normalizeCourseProgress = (cp) => {
      try {
        if (!cp || typeof cp !== "object") return {};
        const out = {};
        Object.keys(cp).forEach((k) => {
          const entry = cp[k] || {};
          const completed = Array.isArray(entry.completedLessons)
            ? entry.completedLessons
            : [];

          out[k] = {
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
        });
        return out;
      } catch (err) {
        // If anything goes wrong here, return empty progress
        console.warn("normalizeCourseProgress failed", err);
        return {};
      }
    };

    const readUserDoc = (uid) => {
      if (!uid) return null;
      try {
        const parsed = safeGetItem(userKey(uid), null);
        return parsed && typeof parsed === "object" ? parsed : null;
      } catch {
        return null;
      }
    };

    const writeUserDoc = (uid, obj) => {
      if (!uid || typeof obj !== "object") return;
      safeSetItem(userKey(uid), obj);
    };

    const readGoalsDoc = (uid) => {
      if (!uid) return null;
      return safeGetItem(goalsKey(uid), null);
    };

    const writeGoalsDoc = (uid, obj) => {
      if (!uid || typeof obj !== "object") return;
      safeSetItem(goalsKey(uid), obj);
    };

    /** Not logged in → no ops */
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

    /** Normalize and create initial data */
    const ensureInitialLocalDoc = () => {
      const existing = readUserDoc(uid) || {};

      const base = {
        enrolledCourses: Array.isArray(existing.enrolledCourses)
          ? [...existing.enrolledCourses]
          : [],

        projects: Array.isArray(existing.projects) ? [...existing.projects] : [],

        isPremium: Boolean(existing.isPremium),
        hasCertificationAccess: Boolean(existing.hasCertificationAccess),
        hasServerAccess: Boolean(existing.hasServerAccess),

        courseProgress: normalizeCourseProgress(existing.courseProgress),

        userStats:
          existing.userStats && typeof existing.userStats === "object"
            ? { ...defaultUserStats(), ...existing.userStats }
            : defaultUserStats(),

        // Always return a new array copy (never undefined)
        generatedProjects: Array.isArray(existing.generatedProjects)
          ? [...existing.generatedProjects]
          : [],

        updatedAt:
          existing.updatedAt &&
          (typeof existing.updatedAt === "number" ||
            typeof existing.updatedAt === "string")
            ? existing.updatedAt
            : nowTs(),
      };

      // Persist normalized doc (best-effort)
      try {
        writeUserDoc(uid, base);
      } catch (err) {
        console.warn("ensureInitialLocalDoc write failed", err);
      }

      return base;
    };

    /** HYDRATE AFTER MOUNT */
    useEffect(() => {
      try {
        if (!canUseLocalStorage()) return;

        const doc = ensureInitialLocalDoc();

        // DEBUG LOG — important for tracking malformed data
        try {
          console.debug("Hydrated user doc:", uid, doc);
        } catch {}

        setEnrolledCourses?.(
          Array.isArray(doc.enrolledCourses) ? doc.enrolledCourses : []
        );
        setCourseProgress?.(doc.courseProgress || {});
        setUserStats?.(doc.userStats || defaultUserStats());

        const g = readGoalsDoc(uid);
        if (g && typeof g === "object") {
          setUserGoals?.(g);
        }

        if (doc.isPremium && setUser) {
          setUser((u) => (u ? { ...u, isPremium: true } : u));
        }
      } catch (e) {
        // Never allow hydration to throw
        console.error("useUserData hydrate error", e);
      }
      // uid is stable
    }, [uid]);

    /** Persist + state update */
    const persistAndNotify = (nextDoc) => {
      try {
        if (!nextDoc || typeof nextDoc !== "object") return;

        const safeNext = {
          enrolledCourses: Array.isArray(nextDoc.enrolledCourses)
            ? [...nextDoc.enrolledCourses]
            : [],
          projects: Array.isArray(nextDoc.projects) ? [...nextDoc.projects] : [],
          isPremium: Boolean(nextDoc.isPremium),
          hasCertificationAccess: Boolean(nextDoc.hasCertificationAccess),
          hasServerAccess: Boolean(nextDoc.hasServerAccess),
          courseProgress: normalizeCourseProgress(nextDoc.courseProgress),
          userStats:
            nextDoc.userStats && typeof nextDoc.userStats === "object"
              ? { ...defaultUserStats(), ...nextDoc.userStats }
              : defaultUserStats(),
          generatedProjects: Array.isArray(nextDoc.generatedProjects)
            ? [...nextDoc.generatedProjects]
            : [],
          updatedAt: nextDoc.updatedAt || nowTs(),
        };

        writeUserDoc(uid, safeNext);

        // ensure global mirror exists and is an array
        try {
          safeSetItem(
            "cybercode_generated_projects_v1",
            Array.isArray(safeNext.generatedProjects) ? safeNext.generatedProjects : []
          );
        } catch (err) {
          // ignore
        }

        setEnrolledCourses?.(safeNext.enrolledCourses);
        setCourseProgress?.(safeNext.courseProgress);
        setUserStats?.(safeNext.userStats);
        setUser?.((u) => (u ? { ...u, isPremium: safeNext.isPremium } : u));
      } catch (e) {
        console.warn("persistAndNotify failed", e);
      }
    };

    /* ============================
          LOCAL MODE FUNCTIONS
       ============================ */

    const enrollInCourse = async (courseSlug) => {
      try {
        const doc = ensureInitialLocalDoc();
        const list = Array.isArray(doc.enrolledCourses)
          ? [...doc.enrolledCourses]
          : [];
        if (!list.includes(courseSlug)) list.push(courseSlug);

        persistAndNotify({
          ...doc,
          enrolledCourses: list,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("enrollInCourse error", e);
      }
    };

    const completeLessonFS = async (courseSlug, lessonSlug) => {
      try {
        const doc = ensureInitialLocalDoc();
        const cp = { ...(doc.courseProgress || {}) };

        const existing = cp[courseSlug] || {
          completedLessons: [],
          currentLessonIndex: 0,
          sessions: [],
          timeSpentMinutes: 0,
        };

        const completed = Array.isArray(existing.completedLessons)
          ? [...existing.completedLessons]
          : [];

        if (!completed.includes(lessonSlug)) completed.push(lessonSlug);

        cp[courseSlug] = {
          ...existing,
          completedLessons: completed,
          currentLessonIndex: completed.length,
          updatedAt: nowTs(),
          sessions: Array.isArray(existing.sessions) ? existing.sessions : [],
          timeSpentMinutes:
            typeof existing.timeSpentMinutes === "number"
              ? existing.timeSpentMinutes
              : 0,
        };

        persistAndNotify({
          ...doc,
          courseProgress: cp,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("completeLessonFS error", e);
      }
    };

    const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
      try {
        if (!minutes || minutes <= 0) return;

        const doc = ensureInitialLocalDoc();
        const usrStats = { ...(doc.userStats || defaultUserStats()) };

        const today = new Date().toISOString().split("T")[0];
        usrStats.daily = usrStats.daily || {};
        usrStats.daily[today] = (usrStats.daily[today] || 0) + minutes;
        usrStats.totalMinutes = (usrStats.totalMinutes || 0) + minutes;

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

        const dates = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dates.push(d.toISOString().split("T")[0]);
        }

        usrStats.weeklyMinutes = dates.reduce(
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
          completedLessons: Array.isArray(course.completedLessons)
            ? course.completedLessons
            : [],
          currentLessonIndex:
            typeof course.currentLessonIndex === "number"
              ? course.currentLessonIndex
              : (Array.isArray(course.completedLessons)
                  ? course.completedLessons.length
                  : 0),
        };

        persistAndNotify({
          ...doc,
          userStats: usrStats,
          courseProgress: cp,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("recordStudySession error", e);
      }
    };

    const resetMyProgress = async () => {
      try {
        const doc = ensureInitialLocalDoc();
        persistAndNotify({
          ...doc,
          courseProgress: {},
          userStats: defaultUserStats(),
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("resetMyProgress error", e);
      }
    };

    const grantCertificationAccess = async () => {
      try {
        const doc = ensureInitialLocalDoc();
        persistAndNotify({
          ...doc,
          hasCertificationAccess: true,
          isPremium: true,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("grantCertificationAccess error", e);
      }
    };

    const grantServerAccess = async () => {
      try {
        const doc = ensureInitialLocalDoc();
        persistAndNotify({
          ...doc,
          hasServerAccess: true,
          isPremium: true,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("grantServerAccess error", e);
      }
    };

    const grantFullPremium = async () => {
      try {
        const doc = ensureInitialLocalDoc();
        persistAndNotify({
          ...doc,
          isPremium: true,
          hasCertificationAccess: true,
          hasServerAccess: true,
          updatedAt: nowTs(),
        });
      } catch (e) {
        console.warn("grantFullPremium error", e);
      }
    };

    const saveUserGoals = async (goals) => {
      try {
        if (!goals || typeof goals !== "object") return;

        const payload = {
          ...goals,
          updatedAt: nowTs(),
          createdAt: goals.createdAt || nowTs(),
        };

        writeGoalsDoc(uid, payload);
        setUserGoals?.(payload);
        safeSetItem("cc_goals_" + uid, payload);
      } catch (e) {
        console.warn("saveUserGoals error", e);
      }
    };

    const loadGeneratedProjects = async () => {
      try {
        const doc = ensureInitialLocalDoc();
        const list = Array.isArray(doc.generatedProjects)
          ? [...doc.generatedProjects]
          : [];

        // ensure global mirror exists and is array
        try {
          safeSetItem(
            "cybercode_generated_projects_v1",
            Array.isArray(list) ? list : []
          );
        } catch {}

        return Array.isArray(list) ? list : [];
      } catch (e) {
        console.error("loadGeneratedProjects failed", e);

        const parsed = safeGetItem("cybercode_generated_projects_v1", []);
        return Array.isArray(parsed) ? parsed : [];
      }
    };

    const saveGeneratedProject = async (project) => {
      try {
        if (!project || typeof project !== "object") return project;

        const doc = readUserDoc(uid) || ensureInitialLocalDoc();
        const gp = Array.isArray(doc.generatedProjects)
          ? [...doc.generatedProjects]
          : [];

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

        const arr = safeGetItem("cybercode_generated_projects_v1", []);
        const withId = {
          ...project,
          id: project.id || `${nowTs()}-${Math.random()}`,
          timestamp: nowTs(),
        };

        const next = Array.isArray(arr) ? [...arr, withId] : [withId];

        safeSetItem("cybercode_generated_projects_v1", next);

        return withId;
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
  } catch (err) {
    // Fatal internal error: log it and return a safe no-op API to avoid crashing the app.
    console.error("Fatal useUserData error:", err);
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
}
