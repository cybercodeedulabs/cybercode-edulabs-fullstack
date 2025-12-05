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
      const raw = localStorage.getItem(GENERATED_PROJECTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const loadGeneratedProjectsLocal = async () => {
    try {
      const raw = localStorage.getItem(GENERATED_PROJECTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const p = Array.isArray(parsed) ? parsed : [];
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
      const base = Array.isArray(prev) ? prev : [];
      const next = [...base, withId];
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
      const raw = localStorage.getItem(USER_GOALS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
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
      const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed || {};
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
  ---------------------------------------*/
  const [hydrated, setHydrated] = useState(false);

  /* --------------------------------------
        AUTH LISTENER (LOCAL MODE)
  ---------------------------------------*/
  useEffect(() => {
    if (!USE_FIREBASE) {
      loadGeneratedProjectsLocal();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------------------------
        SYNC PROJECTS (runs after firestore created)
        - Only runs when user changes to avoid loops
  ---------------------------------------*/
  useEffect(() => {
    let mounted = true;

    const syncProjects = async () => {
      try {
        const remote = await (firestore && typeof firestore.loadGeneratedProjects === "function"
          ? firestore.loadGeneratedProjects()
          : Promise.resolve([]));

        if (Array.isArray(remote) && remote.length > 0) {
          if (!mounted) return;
          setGeneratedProjects(remote);
          try {
            localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(remote));
          } catch {}
          return;
        }

        // fallback: global
        try {
          const raw = localStorage.getItem(GENERATED_PROJECTS_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) {
            if (!mounted) return;
            setGeneratedProjects(parsed);
            return;
          }
        } catch {}

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
      const remote =
        firestore && typeof firestore.loadGeneratedProjects === "function"
          ? await firestore.loadGeneratedProjects()
          : null;
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
      const saved =
        firestore && typeof firestore.saveGeneratedProject === "function"
          ? await firestore.saveGeneratedProject(project)
          : null;
      if (saved) {
        const base = Array.isArray(generatedProjects) ? generatedProjects : [];
        const next = [...base, saved];
        setGeneratedProjects(next);
        try {
          localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        } catch {}
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
      firestore?.enrollInCourse?.(courseSlug);
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
        new Set([
          ...(Array.isArray(existing.completedLessons)
            ? existing.completedLessons
            : []),
          lessonSlug,
        ])
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
