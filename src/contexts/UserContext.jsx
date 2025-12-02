import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();

/* ------------------------------------
   CONSTANTS
-------------------------------------*/
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";
const USE_FIREBASE = false;   // local mode only

/* ------------------------------------
   PROVIDER
-------------------------------------*/
export const UserProvider = ({ children }) => {

  /* -------------------------
     AUTH USER (LOCAL CACHE)
  --------------------------*/
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  /* --------------------------------------
     GENERATED PROJECTS (LOCAL STORAGE)
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
      const lp =
        JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
      setGeneratedProjects(lp);
      return lp;
    } catch {
      return [];
    }
  };

  const saveGeneratedProjectLocal = async (project) => {
    try {
      const withId = {
        ...project,
        id:
          project.id ||
          `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: project.timestamp || Date.now(),
      };

      setGeneratedProjects((prev) => {
        const next = [...(prev || []), withId];
        localStorage.setItem(
          GENERATED_PROJECTS_KEY,
          JSON.stringify(next)
        );
        return next;
      });

      return withId;
    } catch (err) {
      console.warn("Failed to save project locally:", err);
      return project;
    }
  };

  /* -------------------------
     AUTH LISTENER
  --------------------------*/
  useEffect(() => {
    if (!USE_FIREBASE) {
      loadGeneratedProjectsLocal();
      setLoading(false);
      return;
    }

    // Firebase disabled → no listener runs.
  }, []);

  /* --------------------------------------
     USER GOALS + COURSE PROGRESS
  ---------------------------------------*/
  const [userGoals, setUserGoals] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [userStats, setUserStats] = useState({});

  /* --------------------------------------
     PERSONA SCORES
  ---------------------------------------*/
  const [personaScores, setPersonaScores] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(PERSONA_STORAGE_KEY)) || {}
      );
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

  const getTopPersona = () => {
    const entries = Object.entries(personaScores || {});
    if (!entries.length) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return {
      persona: entries[0][0],
      score: entries[0][1],
      all: entries,
    };
  };

  /* --------------------------------------
     FIRESTORE / LOCAL HOOK (LOCAL MODE)
  ---------------------------------------*/
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...prev, ...next };
        localStorage.setItem(
          "cybercodeUser",
          JSON.stringify(merged)
        );
        return merged;
      });
    },
    setUserGoals,
    setUserStats,
  });

  /* --------------------------------------
     SAVE USER GOALS (LOCAL FALLBACK)
  ---------------------------------------*/
  const saveUserGoals =
    firestore?.saveUserGoals ||
    (async (goals) => {
      const now = Date.now();
      const payload = {
        ...goals,
        updatedAt: now,
        createdAt: goals?.createdAt || now,
      };

      setUserGoals(payload);
      localStorage.setItem(
        "cybercode_user_goals",
        JSON.stringify(payload)
      );

      return payload;
    });

  /* --------------------------------------
     COURSE ENROLL
  ---------------------------------------*/
  const enrollInCourse = async (courseSlug) => {
    if (!user?.uid) return; // user must be logged in

    setEnrolledCourses((prev) =>
      prev.includes(courseSlug) ? prev : [...prev, courseSlug]
    );

    try {
      await firestore?.enrollInCourse?.(courseSlug);
    } catch (err) {
      console.warn("enrollInCourse fallback:", err);
    }
  };

  /* --------------------------------------
     GENERATED PROJECTS (LOCAL + OPTIONAL REMOTE)
  ---------------------------------------*/
  const loadGeneratedProjects = async () => {
    if (firestore?.loadGeneratedProjects) {
      try {
        const list = await firestore.loadGeneratedProjects();
        if (Array.isArray(list)) {
          setGeneratedProjects(list);
          return list;
        }
      } catch (err) {
        console.warn("loadGeneratedProjects (firestore) failed");
      }
    }
    return loadGeneratedProjectsLocal();
  };

  const saveGeneratedProject = async (project) => {
    if (firestore?.saveGeneratedProject) {
      try {
        const saved = await firestore.saveGeneratedProject(project);

        setGeneratedProjects((prev) => {
          const next = [...prev, saved];
          localStorage.setItem(
            GENERATED_PROJECTS_KEY,
            JSON.stringify(next)
          );
          return next;
        });

        return saved;
      } catch (err) {
        console.warn("saveGeneratedProject (fallback)", err);
      }
    }

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

    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem(GENERATED_PROJECTS_KEY);
    localStorage.removeItem(PERSONA_STORAGE_KEY);
    localStorage.removeItem("cybercode_user_goals");

    // remove cached AI roadmaps
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cybercode_ai_roadmap_v"))
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

      const updatedLessons = Array.from(
        new Set([...(existing.completedLessons || []), lessonSlug])
      );

      const next = {
        ...prev,
        [courseSlug]: {
          completedLessons: updatedLessons,
          currentLessonIndex: updatedLessons.length,
          updatedAt: new Date().toISOString(),
        },
      };

      try {
        firestore?.completeLessonFS?.(courseSlug, lessonSlug);
      } catch {}

      return next;
    });
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    Boolean(
      courseProgress?.[courseSlug]?.completedLessons?.includes(
        lessonSlug
      )
    );

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed =
      courseProgress?.[courseSlug]?.completedLessons || [];
    if (!totalLessons) return 0;
    return Math.round((completed.length / totalLessons) * 100);
  };

  /* --------------------------------------
     PROVIDER EXPORT
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
        saveGeneratedProject,
        loadGeneratedProjects,

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
