// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();

// ----------------------------
// CONSTANTS
// ----------------------------
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";
const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

export const UserProvider = ({ children }) => {
  // -----------------------------------------------------
  // AUTH USER (LOCAL CACHE LOAD)
  // -----------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------
  // AI-GENERATED PROJECTS (LOCAL CACHE)
  // -----------------------------------------------------
  const [generatedProjects, setGeneratedProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  });

  const loadGeneratedProjectsLocal = async () => {
    try {
      const lp = JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
      setGeneratedProjects(lp);
    } catch {
      // ignore
    }
  };

  const saveGeneratedProjectLocal = async (project) => {
    try {
      const withId = {
        ...project,
        id: project.id || `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      setGeneratedProjects((prev) => {
        const next = [...prev, withId];
        localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        return next;
      });
      return withId;
    } catch (err) {
      console.error("Saving generated project failed (local):", err);
    }
  };

  // -----------------------------------------------------
  // AUTH LISTENER (DISABLED IF FIREBASE = OFF)
  // -----------------------------------------------------
  useEffect(() => {
    if (!USE_FIREBASE) {
      // LOCAL MODE: No Firebase, no listener
      loadGeneratedProjectsLocal();
      setLoading(false);
      return;
    }

    // FIREBASE MODE (optional future)
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const stored = JSON.parse(localStorage.getItem("cybercodeUser")) || {};

        const merged = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: stored.name || firebaseUser.displayName || "",
          photo: stored.photo || firebaseUser.photoURL || "",
          phone: stored.phone || "",
          role: stored.role || "",
          about: stored.about || "",
          isPremium: stored.isPremium || false,
        };

        setUser(merged);
        localStorage.setItem("cybercodeUser", JSON.stringify(merged));

        await loadGeneratedProjectsLocal();
      } else {
        setUser(null);
        localStorage.removeItem("cybercodeUser");
        localStorage.removeItem(GENERATED_PROJECTS_KEY);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // -----------------------------------------------------
  // USER GOALS / PERSONA / COURSE PROGRESS
  // -----------------------------------------------------
  const [userGoals, setUserGoals] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // PERSONA SCORES
  const [personaScores, setPersonaScores] = useState(() => {
    try {
      const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
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
        for (const [k, v] of Object.entries(obj)) {
          next[k] = (next[k] || 0) + (v || 0);
        }
      }

      localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getTopPersona = () => {
    const list = Object.entries(personaScores);
    if (!list.length) return null;
    list.sort((a, b) => b[1] - a[1]);
    return { persona: list[0][0], score: list[0][1], all: list };
  };

  // -----------------------------------------------------
  // FIRESTORE HOOK -> replaced by LOCAL useUserData implementation
  // -----------------------------------------------------
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...prev, ...next };
        localStorage.setItem("cybercodeUser", JSON.stringify(merged));
        return merged;
      });
    },
    setUserGoals,
  });

  const saveUserGoals = firestore.saveUserGoals;

  // -----------------------------------------------------
  // COURSE ENROLL WRAPPER (LOCAL)
  // -----------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    if (!user?.uid) return;

    setEnrolledCourses((prev) =>
      prev.includes(courseSlug) ? prev : [...prev, courseSlug]
    );

    try {
      if (firestore?.enrollInCourse) {
        await firestore.enrollInCourse(courseSlug);
      }
    } catch (err) {
      console.error("Enroll failed (local mode):", err);
    }
  };

  // -----------------------------------------------------
  // LOGOUT (LOCAL MODE)
  // -----------------------------------------------------
  const logout = async () => {
    if (USE_FIREBASE) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn("Sign out error:", err);
      }
    }

    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);
    setUserGoals(null);

    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem(GENERATED_PROJECTS_KEY);
    localStorage.removeItem(PERSONA_STORAGE_KEY);

    Object.keys(localStorage)
      .filter((k) => k.startsWith("cybercode_ai_roadmap_v1"))
      .forEach((k) => localStorage.removeItem(k));

    window.location.href = "/";
  };

  // -----------------------------------------------------
  // LESSON PROGRESS MANAGEMENT (LOCAL)
  // -----------------------------------------------------
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    try {
      setCourseProgress((prev) => {
        const existing = prev[courseSlug] || {
          completedLessons: [],
          currentLessonIndex: 0,
        };

        const updatedLessons = Array.from(
          new Set([...existing.completedLessons, lessonSlug])
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
        } catch (e) {
          console.warn("Local persist of completeLessonFS failed", e);
        }

        return next;
      });
    } catch (err) {
      console.error("completeLessonFS failed:", err);
    }
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    courseProgress?.[courseSlug]?.completedLessons?.includes(lessonSlug) ||
    false;

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed =
      courseProgress?.[courseSlug]?.completedLessons || [];
    if (!totalLessons) return 0;
    return Math.round((completed.length / totalLessons) * 100);
  };

  // -----------------------------------------------------
  // PROVIDER
  // -----------------------------------------------------
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
        saveGeneratedProject: saveGeneratedProjectLocal,
        loadGeneratedProjects: loadGeneratedProjectsLocal,
        completeLessonFS,
        isLessonCompleted,
        getCourseCompletion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
