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
   PROVIDER
-------------------------------------*/
export const UserProvider = ({ children }) => {
  /* -------------------------
        AUTH (LOCAL USER)
  --------------------------*/
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
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
      return JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  });

  const loadGeneratedProjectsLocal = async () => {
    try {
      const p = JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
      setGeneratedProjects(p);
      return p;
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
      const next = [...(prev || []), withId];
      try {
        localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    return withId;
  };

  /* --------------------------------------
        USER GOALS + PROGRESS
  ---------------------------------------*/
  const [userGoals, setUserGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_GOALS_KEY)) || null;
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
      return JSON.parse(localStorage.getItem(PERSONA_STORAGE_KEY)) || {};
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
        localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const getTopPersona = () => {
    const entries = Object.entries(personaScores || {});
    if (!entries.length)
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
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...(prev || {}), ...(next || {}) };
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      });
    },
    setUserGoals,
    setUserStats,
  });

  /* --------------------------------------
        HYDRATION GATE
        - Ensures app renders only after we have attempted to load projects/goals/stats
  ---------------------------------------*/
  const [hydrated, setHydrated] = useState(false);

  /* --------------------------------------
        AUTH LISTENER (LOCAL MODE)
        - Initial quick load for global key to render shell fast
  ---------------------------------------*/
  useEffect(() => {
    if (!USE_FIREBASE) {
      // quick local load (not the authoritative per-user load)
      loadGeneratedProjectsLocal();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------
        SYNC PROJECTS (runs after firestore created)
        - IMPORTANT: do NOT include `firestore` in deps (it causes loops in some setups)
        - We run sync when `user` changes (login/logout) so per-user data loads deterministically
  ---------------------------------------*/
  useEffect(() => {
    let mounted = true;

    const syncProjects = async () => {
      try {
        // 1) Try to read remote/per-user copy (via hook)
        const remote = await firestore?.loadGeneratedProjects?.();
        if (Array.isArray(remote) && remote.length > 0) {
          if (!mounted) return;
          setGeneratedProjects(remote);
          try {
            localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(remote));
          } catch {}
          return;
        }

        // 2) Fallback to global key if remote empty
        try {
          const raw = localStorage.getItem(GENERATED_PROJECTS_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) {
            if (!mounted) return;
            setGeneratedProjects(parsed);
            return;
          }
        } catch {}

        // 3) Final fallback: ensure empty array
        if (!mounted) return;
        setGeneratedProjects([]);
      } catch (e) {
        // safe fallback
        if (!mounted) return;
        setGeneratedProjects([]);
      } finally {
        // mark hydrated only after sync finishes at least once
        if (mounted) {
          setHydrated(true);
          setLoading(false);
        }
      }
    };

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
      const remote = await firestore?.loadGeneratedProjects?.();
      if (Array.isArray(remote)) {
        setGeneratedProjects(remote);
        try {
          localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(remote));
        } catch {}
        return remote;
      }
    } catch {
      // continue to fallback
    }

    try {
      const raw = localStorage.getItem(GENERATED_PROJECTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
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
      const saved = await firestore?.saveGeneratedProject?.(project);
      if (saved) {
        const next = [...(generatedProjects || []), saved];
        setGeneratedProjects(next);
        try {
          localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        } catch {}
        return saved;
      }
    } catch (e) {
      // continue to fallback
      console.warn("saveGeneratedProject failed in UserContext", e);
    }

    // fallback to local-only implementation
    return saveGeneratedProjectLocal(project);
  };

  /* --------------------------------------
        SAVE USER GOALS  (keeps parity with useUserData hook)
  ---------------------------------------*/
  const saveUserGoals = async (goals) => {
    try {
      const payload =
        (await firestore?.saveUserGoals?.(goals)) ||
        {
          ...goals,
          updatedAt: Date.now(),
          createdAt: goals?.createdAt || Date.now(),
        };

      setUserGoals(payload);

      try {
        localStorage.setItem(USER_GOALS_KEY, JSON.stringify(payload));
      } catch {}

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

    setEnrolledCourses((prev) =>
      prev.includes(courseSlug) ? prev : [...prev, courseSlug]
    );

    try {
      await firestore?.enrollInCourse?.(courseSlug);
    } catch {}
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
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(GENERATED_PROJECTS_KEY);
      localStorage.removeItem(PERSONA_STORAGE_KEY);
      localStorage.removeItem(USER_GOALS_KEY);
    } catch {}

    Object.keys(localStorage || {})
      .filter((k) => k.startsWith("cybercode_ai_roadmap"))
      .forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });

    window.location.href = "/";
  };

  /* --------------------------------------
        LESSON PROGRESS
  ---------------------------------------*/
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    setCourseProgress((prev) => {
      const existing =
        prev?.[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };

      const updated = Array.from(
        new Set([...(existing.completedLessons || []), lessonSlug])
      );

      try {
        firestore?.completeLessonFS?.(courseSlug, lessonSlug);
      } catch {}

      return {
        ...prev,
        [courseSlug]: {
          completedLessons: updated,
          currentLessonIndex: updated.length,
        },
      };
    });
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    Boolean(
      courseProgress?.[courseSlug]?.completedLessons?.includes(lessonSlug)
    );

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed = courseProgress?.[courseSlug]?.completedLessons || [];
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
        hydrated, // important flag for consumers
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
      {/* hydration gate: show loading placeholder until context is ready */}
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
