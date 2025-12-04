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
      const next = [...prev, withId];
      localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
      return next;
    });

    return withId;
  };

  /* --------------------------------------
        AUTH LISTENER (LOCAL MODE)
  ---------------------------------------*/
  useEffect(() => {
    if (!USE_FIREBASE) {
      loadGeneratedProjectsLocal();
      setLoading(false);
      return;
    }
  }, []);

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

      localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  /* --------------------------------------
        SAFE TOP PERSONA
  ---------------------------------------*/
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
        CONNECT WITH useUserData HOOK
  ---------------------------------------*/
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...(prev || {}), ...(next || {}) };
        localStorage.setItem(USER_KEY, JSON.stringify(merged));
        return merged;
      });
    },
    setUserGoals,
    setUserStats,
  });

  /* --------------------------------------
        SAVE GOALS
  ---------------------------------------*/
  const saveUserGoals =
    firestore?.saveUserGoals ||
    (async (goals) => {
      const payload = {
        ...goals,
        updatedAt: Date.now(),
        createdAt: goals?.createdAt || Date.now(),
      };

      setUserGoals(payload);
      localStorage.setItem(USER_GOALS_KEY, JSON.stringify(payload));
      return payload;
    });

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
        PROJECTS SYNC
  ---------------------------------------*/
const loadGeneratedProjects = async () => {
  try {
    const remote = await firestore?.loadGeneratedProjects?.();

    if (Array.isArray(remote)) {
      setGeneratedProjects(remote);
      return remote;
    }

    // Important fix: ensure generatedProjects is ALWAYS an array
    setGeneratedProjects([]);
    return [];
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
      localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
      return saved;
    }
  } catch {
    console.warn("saveGeneratedProject failed in UserContext");
  }

  // fallback
  return saveGeneratedProjectLocal(project);
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

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GENERATED_PROJECTS_KEY);
    localStorage.removeItem(PERSONA_STORAGE_KEY);
    localStorage.removeItem(USER_GOALS_KEY);

    Object.keys(localStorage)
      .filter((k) => k.startsWith("cybercode_ai_roadmap"))
      .forEach((k) => localStorage.removeItem(k));

    window.location.href = "/";
  };

  /* --------------------------------------
        LESSON PROGRESS
  ---------------------------------------*/
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    setCourseProgress((prev) => {
      const existing =
        prev?.[courseSlug] || {
          completedLessons: [],
          currentLessonIndex: 0,
        };

      const updated = Array.from(
        new Set([...(existing.completedLessons || []), lessonSlug])
      );

      const next = {
        ...prev,
        [courseSlug]: {
          completedLessons: updated,
          currentLessonIndex: updated.length,
        },
      };

      try {
        firestore?.completeLessonFS?.(courseSlug, lessonSlug);
      } catch {}

      return next;
    });
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    Boolean(courseProgress?.[courseSlug]?.completedLessons?.includes(lessonSlug));

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed = courseProgress?.[courseSlug]?.completedLessons || [];
    return totalLessons ? Math.round((completed.length / totalLessons) * 100) : 0;
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
      {children}
    </UserContext.Provider>
  );
};

/* --------------------------------------
        HOOK EXPORT
---------------------------------------*/
export const useUser = () => useContext(UserContext);
