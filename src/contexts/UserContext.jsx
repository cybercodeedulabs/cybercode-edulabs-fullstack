// src/contexts/UserContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import useUserData from "../hooks/useUserData";

/* ------------------------------------
   CONSTANTS
-------------------------------------*/
const UserContext = createContext();

const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";
const USER_GOALS_KEY = "cybercode_user_goals";
const USER_KEY = "cybercodeUser";

const USE_FIREBASE = false; // FULL LOCAL MODE ONLY

/* ------------------------------------
   SAFE LOCALSTORAGE HELPERS
   (prevent throws during hydration / privacy mode)
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
      const testKey = "__cc_test__";
      try {
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        cached = true;
      } catch {
        cached = false;
      }
      return cached;
    } catch {
      cached = false;
      return cached;
    }
  };
})();

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

/* ------------------------------------
   PROVIDER
-------------------------------------*/
export const UserProvider = ({ children }) => {
  /* -------------------------
        AUTH (LOCAL USER)
  --------------------------*/
  const [user, setUser] = useState(() => {
    try {
      const parsed = safeGetItem(USER_KEY, null);
      return parsed || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  /* --------------------------------------
        GENERATED PROJECTS
  ---------------------------------------*/
  const [generatedProjects, setGeneratedProjects] = useState(() => {
    try {
      const parsed = safeGetItem(GENERATED_PROJECTS_KEY, []);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const loadGeneratedProjectsLocal = async () => {
    try {
      const p = safeGetItem(GENERATED_PROJECTS_KEY, []);
      const arr = Array.isArray(p) ? p : [];
      setGeneratedProjects(arr);
      return arr;
    } catch {
      setGeneratedProjects([]);
      return [];
    }
  };

  const saveGeneratedProjectLocal = async (project) => {
    const withId = {
      ...project,
      id: project.id || `${Date.now()}-${Math.random()}`,
      timestamp: project.timestamp || Date.now(),
    };

    setGeneratedProjects((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      const next = [...base, withId];
      try {
        safeSetItem(GENERATED_PROJECTS_KEY, next);
      } catch { }
      return next;
    });

    return withId;
  };

  /* --------------------------------------
        USER GOALS + PROGRESS
  ---------------------------------------*/
  const [userGoals, setUserGoals] = useState(() => {
    try {
      const parsed = safeGetItem(USER_GOALS_KEY, null);
      return parsed || null;
    } catch {
      return null;
    }
  });

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [userStats, setUserStats] = useState({});

  /* --------------------------------------
        PERSONA SCORES
  ---------------------------------------*/
  const [personaScores, setPersonaScores] = useState(() => {
    try {
      const parsed = safeGetItem(PERSONA_STORAGE_KEY, {});
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  const updatePersonaScore = (obj, delta = 0) => {
    setPersonaScores((prev) => {
      const next = { ...(prev || {}) };

      if (typeof obj === "string") {
        next[obj] = (next[obj] || 0) + delta;
      } else {
        for (const [k, v] of Object.entries(obj || {})) {
          next[k] = (next[k] || 0) + (v || 0);
        }
      }

      try {
        safeSetItem(PERSONA_STORAGE_KEY, next);
      } catch { }
      return next;
    });
  };

  const getTopPersona = () => {
    const entries = Object.entries(personaScores || {});
    if (!entries || entries.length === 0)
      return { persona: "beginner", score: 0, all: [["beginner", 0]] };

    entries.sort((a, b) => b[1] - a[1]);
    const top = entries[0];

    return {
      persona: top[0],
      score: Number(top[1]),
      all: entries,
    };
  };

  /* --------------------------------------
        CONNECT WITH useUserData HOOK (MUST COME BEFORE syncProjects!)
  ---------------------------------------*/
  /* --------------------------------------
        CONNECT WITH useUserData HOOK (MUST COME BEFORE syncProjects!)
  ---------------------------------------*/

  // If user is NOT logged in → return no-op API to prevent hydration crashes
  const firestore = user?.uid
    ? useUserData(user, {
      setEnrolledCourses,
      setCourseProgress,
      setUser: (updater) => {
        setUser((prev) => {
          const next = typeof updater === "function" ? updater(prev) : updater;
          const merged = { ...(prev || {}), ...(next || {}) };
          try {
            safeSetItem(USER_KEY, merged);
          } catch { }
          return merged;
        });
      },
      setUserGoals,
      setUserStats,
    })
    : {
      enrollInCourse: async () => { },
      completeLessonFS: async () => { },
      recordStudySession: async () => { },
      resetMyProgress: async () => { },
      grantCertificationAccess: async () => { },
      grantServerAccess: async () => { },
      grantFullPremium: async () => { },
      saveUserGoals: async () => { },
      loadGeneratedProjects: async () => [],
      saveGeneratedProject: async (p) => p,
    };


  /* --------------------------------------
        HYDRATION GATE
  ---------------------------------------*/
  const [hydrated, setHydrated] = useState(false);

  /* --------------------------------------
        AUTH LISTENER (LOCAL MODE)
  ---------------------------------------*/
  useEffect(() => {
    if (!USE_FIREBASE) {
      // Ensure we always load local generated projects on mount
      loadGeneratedProjectsLocal();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------
        Ensure global generatedProjects key exists (avoid null)
  ---------------------------------------*/
  useEffect(() => {
    if (!canUseLocalStorage()) return;
    try {
      const existing = safeGetItem(GENERATED_PROJECTS_KEY, null);
      if (!Array.isArray(existing)) {
        safeSetItem(GENERATED_PROJECTS_KEY, []);
      }
    } catch { }
  }, []);

  /* --------------------------------------
        SYNC PROJECTS (runs after firestore created)
        - Only runs when user changes to avoid loops
  ---------------------------------------*/
  useEffect(() => {
    let mounted = true;

    const syncProjects = async () => {
      try {
        const loader =
          firestore && typeof firestore.loadGeneratedProjects === "function"
            ? firestore.loadGeneratedProjects()
            : Promise.resolve([]);

        const remote = await loader;

        const remoteArr = Array.isArray(remote) ? remote : [];

        if (remoteArr.length > 0) {
          if (!mounted) return;
          setGeneratedProjects(remoteArr);
          try {
            safeSetItem(GENERATED_PROJECTS_KEY, remoteArr);
          } catch { }
          return;
        }

        // fallback: global
        const raw = safeGetItem(GENERATED_PROJECTS_KEY, []);
        const parsed = Array.isArray(raw) ? raw : [];
        if (parsed.length > 0) {
          if (!mounted) return;
          setGeneratedProjects(parsed);
          return;
        }

        if (!mounted) return;
        setGeneratedProjects([]);
      } catch (err) {
        // safe fallback
        console.warn("syncProjects error", err);
        if (!mounted) return;
        setGeneratedProjects([]);
      } finally {
        if (mounted) {
          setHydrated(true);
          setLoading(false);
        }
      }
    };

    // only run sync when user changes or on first mount of provider
    syncProjects();

    return () => {
      mounted = false;
    };
    // intentionally only user in deps to avoid reactive loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* --------------------------------------
        PROJECT API (load/save)
  ---------------------------------------*/
  const loadGeneratedProjects = async () => {
    try {
      const loader =
        firestore && typeof firestore.loadGeneratedProjects === "function"
          ? firestore.loadGeneratedProjects()
          : null;
      const remote = loader ? await loader : null;
      if (Array.isArray(remote)) {
        setGeneratedProjects(remote);
        try {
          safeSetItem(GENERATED_PROJECTS_KEY, remote);
        } catch { }
        return remote;
      }
    } catch {
      // continue to fallback
    }

    try {
      const parsed = safeGetItem(GENERATED_PROJECTS_KEY, []);
      const arr = Array.isArray(parsed) ? parsed : [];
      setGeneratedProjects(arr);
      return arr;
    } catch {
      setGeneratedProjects([]);
      return [];
    }
  };

  const saveGeneratedProject = async (project) => {
    try {
      const saver =
        firestore && typeof firestore.saveGeneratedProject === "function"
          ? firestore.saveGeneratedProject(project)
          : null;
      const saved = saver ? await saver : null;
      if (saved) {
        const base = Array.isArray(generatedProjects) ? generatedProjects : [];
        const next = [...base, saved];
        setGeneratedProjects(next);
        try {
          safeSetItem(GENERATED_PROJECTS_KEY, next);
        } catch { }
        return saved;
      }
    } catch (e) {
      console.warn("saveGeneratedProject failed in UserContext", e);
    }

    // fallback to local-only implementation
    return saveGeneratedProjectLocal(project);
  };

  /* --------------------------------------
        SAVE USER GOALS
  ---------------------------------------*/
  const saveUserGoals = async (goals) => {
    try {
      const payload =
        (firestore && typeof firestore.saveUserGoals === "function"
          ? await firestore.saveUserGoals(goals)
          : null) ||
        {
          ...goals,
          updatedAt: Date.now(),
          createdAt: goals?.createdAt || Date.now(),
        };

      setUserGoals(payload);

      try {
        safeSetItem(USER_GOALS_KEY, payload);
      } catch { }

      return payload;
    } catch {
      return goals;
    }
  };

  /* --------------------------------------
        ENROLL COURSE
  ---------------------------------------*/
  const enrollInCourse = async (courseSlug) => {
    if (!user?.uid) return;
    setEnrolledCourses((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(courseSlug) ? arr : [...arr, courseSlug];
    });
    try {
      firestore?.enrollInCourse?.(courseSlug);
    } catch { }
  };

  /* --------------------------------------
        LOGOUT
  ---------------------------------------*/
  const logout = async () => {
    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);
    setUserGoals(null);
    setUserStats({});

    try {
      if (canUseLocalStorage()) {
        window.localStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(GENERATED_PROJECTS_KEY);
        window.localStorage.removeItem(PERSONA_STORAGE_KEY);
        window.localStorage.removeItem(USER_GOALS_KEY);
      }
    } catch { }

    try {
      if (canUseLocalStorage()) {
        const keys = Object.keys(window.localStorage || {});
        keys
          .filter((k) => typeof k === "string" && k.startsWith("cybercode_ai_roadmap"))
          .forEach((k) => {
            try {
              window.localStorage.removeItem(k);
            } catch { }
          });
      }
    } catch { }

    // Redirect to root
    try {
      window.location.href = "/";
    } catch { }
  };

  /* --------------------------------------
        LESSON PROGRESS
  ---------------------------------------*/
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    setCourseProgress((prev) => {
      const safePrev = prev && typeof prev === "object" ? prev : {};
      const existing =
        safePrev[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };

      const completedBase = Array.isArray(existing.completedLessons)
        ? existing.completedLessons
        : [];
      const updated = Array.from(new Set([...completedBase, lessonSlug]));

      try {
        firestore?.completeLessonFS?.(courseSlug, lessonSlug);
      } catch { }

      return {
        ...safePrev,
        [courseSlug]: {
          completedLessons: updated,
          currentLessonIndex: updated.length,
          sessions: Array.isArray(existing.sessions) ? existing.sessions : [],
          timeSpentMinutes:
            typeof existing.timeSpentMinutes === "number"
              ? existing.timeSpentMinutes
              : 0,
        },
      };
    });
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

  /* --------------------------------------
        EXPORT CONTEXT
  ---------------------------------------*/
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
        setUserGoals,
        saveUserGoals,

        generatedProjects,
        loadGeneratedProjects,
        saveGeneratedProject,

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

/* --------------------------------------
        HOOK EXPORT
---------------------------------------*/
export const useUser = () => useContext(UserContext);
