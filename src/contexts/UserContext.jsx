// src/contexts/UserContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

/* ------------------------------------
   CONSTANTS
-------------------------------------*/
const UserContext = createContext();

const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";
const USER_GOALS_KEY = "cybercode_user_goals";
const USER_KEY = "cybercodeUser";

/* ------------------------------------
   LOCALSTORAGE SAFETY LAYER
-------------------------------------*/
const canUseLocalStorage = (() => {
  let cached = null;
  return () => {
    if (cached !== null) return cached;
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        cached = false;
        return cached;
      }
      const test = "__cc_test__";
      window.localStorage.setItem(test, "1");
      window.localStorage.removeItem(test);
      cached = true;
      return cached;
    } catch {
      cached = false;
      return cached;
    }
  };
})();

const safeParse = (raw, fallback = null) => {
  try {
    if (!raw && raw !== "") return fallback;
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

/* ------------------------------------
   PROVIDER
-------------------------------------*/
export const UserProvider = ({ children }) => {
  /* ------------------------------------
        USER (LOCAL ONLY)
  -------------------------------------*/
  const [user, _setUser] = useState(() => safeGetItem(USER_KEY, null));
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const setUser = (v) => {
    const next = typeof v === "function" ? v(user) : v;
    _setUser(next);
    try {
      safeSetItem(USER_KEY, next);
    } catch {}
  };

  /* ------------------------------------
        GENERATED PROJECTS
  -------------------------------------*/
  const [generatedProjects, setGeneratedProjects] = useState(() =>
    Array.isArray(safeGetItem(GENERATED_PROJECTS_KEY, []))
      ? safeGetItem(GENERATED_PROJECTS_KEY, [])
      : []
  );

  const saveGeneratedProjectLocal = async (project) => {
    const withId = {
      ...project,
      id: project.id || `${Date.now()}-${Math.random()}`,
      timestamp: project.timestamp || Date.now(),
    };

    setGeneratedProjects((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      const next = [...arr, withId];
      safeSetItem(GENERATED_PROJECTS_KEY, next);
      return next;
    });

    // Mirror to per-user doc if user present
    try {
      if (user?.uid && canUseLocalStorage()) {
        const docKey = `cc_userdoc_${user.uid}`;
        const existing = safeGetItem(docKey, {}) || {};
        const gp = Array.isArray(existing.generatedProjects)
          ? [...existing.generatedProjects, withId]
          : [withId];
        safeSetItem(docKey, { ...existing, generatedProjects: gp, updatedAt: Date.now() });
      }
    } catch {}

    return withId;
  };

  const loadGeneratedProjects = async () => {
    const arr = safeGetItem(GENERATED_PROJECTS_KEY, []);
    const final = Array.isArray(arr) ? arr : [];
    setGeneratedProjects(final);
    return final;
  };

  /* ------------------------------------
        USER GOALS
  -------------------------------------*/
  const [userGoals, setUserGoals] = useState(() =>
    safeGetItem(USER_GOALS_KEY, null)
  );

  const saveUserGoals = async (goals) => {
    const payload = {
      ...goals,
      updatedAt: Date.now(),
      createdAt: goals?.createdAt ?? Date.now(),
    };
    setUserGoals(payload);
    safeSetItem(USER_GOALS_KEY, payload);

    // persist per-user goals if logged in
    try {
      if (user?.uid && canUseLocalStorage()) {
        const docKey = `cc_userdoc_${user.uid}`;
        const existing = safeGetItem(docKey, {}) || {};
        safeSetItem(docKey, { ...existing, goals: payload, updatedAt: Date.now() });
      }
    } catch {}

    return payload;
  };

  /* ------------------------------------
        PERSONA SCORES
  -------------------------------------*/
  const [personaScores, setPersonaScores] = useState(() => {
    const parsed = safeGetItem(PERSONA_STORAGE_KEY, {});
    return parsed && typeof parsed === "object" ? parsed : {};
  });

  const updatePersonaScore = (obj, delta = 0) => {
    setPersonaScores((prev) => {
      const next = { ...(prev || {}) };

      if (typeof obj === "string") {
        next[obj] = (next[obj] || 0) + delta;
      } else if (obj && typeof obj === "object") {
        for (const [k, v] of Object.entries(obj)) {
          next[k] = (next[k] || 0) + (v || 0);
        }
      }

      safeSetItem(PERSONA_STORAGE_KEY, next);
      return next;
    });
  };

  const getTopPersona = () => {
    const entries = Object.entries(personaScores || {});
    if (entries.length === 0)
      return { persona: "beginner", score: 0, all: [["beginner", 0]] };

    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    return {
      persona: sorted[0][0],
      score: Number(sorted[0][1]),
      all: sorted,
    };
  };

  /* ------------------------------------
        COURSE & PROGRESS (LOCAL MODE)
  -------------------------------------*/
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [userStats, setUserStats] = useState({});

  // helper: persist per-user cc_userdoc_<uid>
  const persistUserDoc = (patch = {}) => {
    try {
      if (!canUseLocalStorage()) return;
      if (!user?.uid) return;
      const docKey = `cc_userdoc_${user.uid}`;
      const existing = safeGetItem(docKey, {}) || {};
      const merged = { ...existing, ...patch, updatedAt: Date.now() };
      safeSetItem(docKey, merged);
    } catch (err) {
      // ignore
    }
  };

  const enrollInCourse = async (courseSlug) => {
    if (!user) return;
    setEnrolledCourses((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      const next = arr.includes(courseSlug) ? arr : [...arr, courseSlug];
      // persist to per-user doc
      try {
        persistUserDoc({ enrolledCourses: next });
      } catch {}
      return next;
    });
  };

  /**
   * completeLessonLocal
   * - Local-only, defensive, updates courseProgress state and per-user doc when possible.
   * - Returns the updated courseProgress object for the course.
   */
  const completeLessonLocal = async (courseSlug, lessonSlug) => {
    try {
      // update in-state
      let updatedCourseProgress = null;
      setCourseProgress((prev) => {
        const base = prev && typeof prev === "object" ? prev : {};
        const course = base[courseSlug] || {
          completedLessons: [],
          currentLessonIndex: 0,
          sessions: [],
          timeSpentMinutes: 0,
        };

        const updated = Array.from(
          new Set([...(Array.isArray(course.completedLessons) ? course.completedLessons : []), lessonSlug])
        );

        const nextCourse = {
          ...course,
          completedLessons: updated,
          currentLessonIndex: updated.length,
          sessions: Array.isArray(course.sessions) ? course.sessions : [],
          timeSpentMinutes: typeof course.timeSpentMinutes === "number" ? course.timeSpentMinutes : 0,
          updatedAt: new Date().toISOString(),
        };

        updatedCourseProgress = {
          ...base,
          [courseSlug]: nextCourse,
        };

        // return new state
        return updatedCourseProgress;
      });

      // persist to per-user doc if available
      try {
        persistUserDoc({ courseProgress: updatedCourseProgress[courseSlug] ? { ...updatedCourseProgress } : {} });
      } catch {}

      return updatedCourseProgress;
    } catch (err) {
      console.warn("completeLessonLocal failed", err);
      return null;
    }
  };

  // keep alias for backward compatibility
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    return completeLessonLocal(courseSlug, lessonSlug);
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    Boolean(
      Array.isArray(courseProgress?.[courseSlug]?.completedLessons) &&
        courseProgress[courseSlug].completedLessons.includes(lessonSlug)
    );

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed = Array.isArray(
      courseProgress?.[courseSlug]?.completedLessons
    )
      ? courseProgress[courseSlug].completedLessons
      : [];

    return totalLessons
      ? Math.round((completed.length / totalLessons) * 100)
      : 0;
  };

  /* ------------------------------------
        HYDRATION + INITIAL LOAD
  -------------------------------------*/
  useEffect(() => {
    loadGeneratedProjects();

    // load per-user doc if present and populate courseProgress/enrolledCourses/userStats
    try {
      if (canUseLocalStorage() && user?.uid) {
        const docKey = `cc_userdoc_${user.uid}`;
        const doc = safeGetItem(docKey, null) || {};

        // enrolled courses
        if (Array.isArray(doc.enrolledCourses)) setEnrolledCourses(doc.enrolledCourses);

        // course progress normalization
        if (doc.courseProgress && typeof doc.courseProgress === "object") {
          setCourseProgress(doc.courseProgress);
        }

        // userStats
        if (doc.userStats && typeof doc.userStats === "object") {
          setUserStats(doc.userStats);
        }
      }
    } catch (err) {
      // ignore
    }

    setLoading(false);
    setHydrated(true);
  }, []); // run once on mount

  /* ------------------------------------
        LOGOUT (FULL CLEAN)
  -------------------------------------*/
  const logout = async () => {
    _setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);
    setUserGoals(null);
    setUserStats({});
    setPersonaScores({});

    if (canUseLocalStorage()) {
      try {
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(GENERATED_PROJECTS_KEY);
        window.localStorage.removeItem(PERSONA_STORAGE_KEY);
        window.localStorage.removeItem(USER_GOALS_KEY);

        // Delete old user docs
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith("cc_userdoc_"))
          .forEach((k) => window.localStorage.removeItem(k));

        // Delete AI roadmap drafts
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith("cybercode_ai_roadmap"))
          .forEach((k) => window.localStorage.removeItem(k));
      } catch {}
    }

    try {
      window.location.href = "/";
    } catch {}
  };

  /* ------------------------------------
        EXPORTED CONTEXT VALUE
  -------------------------------------*/
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        hydrated,
        logout,

        enrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress,

        personaScores,
        updatePersonaScore,
        getTopPersona,

        userGoals,
        saveUserGoals,
        setUserGoals,

        generatedProjects,
        saveGeneratedProject: saveGeneratedProjectLocal,
        loadGeneratedProjects,

        // local-only API
        completeLessonLocal,
        // backward compatible alias
        completeLessonFS,

        isLessonCompleted,
        getCourseCompletion,

        userStats,
        setUserStats,
      }}
    >
      {hydrated ? (
        children
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      )}
    </UserContext.Provider>
  );
};

/* ------------------------------------
        HOOK
-------------------------------------*/
export const useUser = () => useContext(UserContext);
