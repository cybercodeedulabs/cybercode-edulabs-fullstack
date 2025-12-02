// src/contexts/UserContext.jsx
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
// import { auth } from "../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();

// ----------------------------
// CONSTANTS
// ----------------------------
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";
const USE_FIREBASE = false;



export const UserProvider = ({ children }) => {
  // AUTH USER (local cache load)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // AI-GENERATED PROJECTS (LOCAL CACHE)
  const [generatedProjects, setGeneratedProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  });

  // load/save helpers for generated projects (local)
  const loadGeneratedProjectsLocal = async () => {
    try {
      const lp = JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
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
        id: project.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: project.timestamp || Date.now(),
      };
      setGeneratedProjects((prev) => {
        const next = [...(prev || []), withId];
        try {
          localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        } catch (e) {
          console.warn("Could not persist generated projects to localStorage", e);
        }
        return next;
      });
      return withId;
    } catch (err) {
      console.error("Saving generated project failed (local):", err);
      return project;
    }
  };

  // -------------------------
  // AUTH LISTENER
  // -------------------------
  useEffect(() => {
    if (!USE_FIREBASE) {
      // LOCAL MODE: load local data and skip firebase listener
      loadGeneratedProjectsLocal();
      setLoading(false);
      return;
    }

    // FIREBASE MODE
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
        try {
          localStorage.setItem("cybercodeUser", JSON.stringify(merged));
        } catch { }
        await loadGeneratedProjectsLocal();
      } else {
        // signed out
        setUser(null);
        try {
          localStorage.removeItem("cybercodeUser");
          localStorage.removeItem(GENERATED_PROJECTS_KEY);
        } catch { }
      }

      setLoading(false);
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------
  // USER GOALS / COURSE PROGRESS / PERSONA
  // -------------------------
  const [userGoals, setUserGoals] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [userStats, setUserStats] = useState({});

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
        for (const [k, v] of Object.entries(obj || {})) {
          next[k] = (next[k] || 0) + (v || 0);
        }
      }

      try {
        localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const getTopPersona = () => {
    const list = Object.entries(personaScores || {});
    if (!list.length) return null;
    list.sort((a, b) => b[1] - a[1]);
    return { persona: list[0][0], score: list[0][1], all: list };
  };

  // -------------------------
  // FIRESTORE / LOCAL HOOK
  // -------------------------
  // useUserData returns the same-fn names used by the app. In local mode it persists to localStorage.
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...prev, ...next };
        try {
          localStorage.setItem("cybercodeUser", JSON.stringify(merged));
        } catch { }
        return merged;
      });
    },
    setUserGoals,
    setUserStats,
  });

  // safe fallback for saveUserGoals
  const saveUserGoals =
    firestore?.saveUserGoals ||
    (async (goals) => {
      try {
        const now = Date.now();
        const payload = { ...goals, updatedAt: now, createdAt: goals?.createdAt || now };
        setUserGoals(payload);
        try {
          localStorage.setItem("cybercode_user_goals", JSON.stringify(payload));
        } catch { }
        return payload;
      } catch (e) {
        console.warn("saveUserGoals fallback failed", e);
        return null;
      }
    });

  // -------------------------
  // COURSE ENROLL (wrapper)
  // -------------------------
  const enrollInCourse = async (courseSlug) => {
    // NOTE: we intentionally require a logged-in user for persistent enrollments.
    // If you want optimistic anonymous enroll (temp), we can add that later.
    if (!user?.uid) return;

    setEnrolledCourses((prev) =>
      prev && Array.isArray(prev) && prev.includes(courseSlug) ? prev : [...(prev || []), courseSlug]
    );

    try {
      await firestore?.enrollInCourse?.(courseSlug);
    } catch (err) {
      console.warn("enrollInCourse (firestore) failed:", err);
    }
  };

  // -------------------------
  // GENERATED PROJECTS (local + firestore)
  // -------------------------
  // If firestore offers load/save, prefer it; otherwise use local helpers above.
  const loadGeneratedProjects = async () => {
    if (firestore?.loadGeneratedProjects) {
      try {
        const list = await firestore.loadGeneratedProjects();
        if (Array.isArray(list)) {
          setGeneratedProjects(list);
          return list;
        }
      } catch (e) {
        console.warn("firestore.loadGeneratedProjects failed", e);
      }
    }
    return loadGeneratedProjectsLocal();
  };

  const saveGeneratedProject = async (project) => {
    if (firestore?.saveGeneratedProject) {
      try {
        const saved = await firestore.saveGeneratedProject(project);
        // persist to local view as well
        setGeneratedProjects((prev) => {
          const next = [...(prev || []), saved];
          try {
            localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
          } catch { }
          return next;
        });
        return saved;
      } catch (e) {
        console.warn("firestore.saveGeneratedProject failed, falling back to local", e);
      }
    }
    return saveGeneratedProjectLocal(project);
  };

  // -------------------------
  // LOGOUT
  // -------------------------
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

    try {
      localStorage.removeItem("cybercodeUser");
      localStorage.removeItem(GENERATED_PROJECTS_KEY);
      localStorage.removeItem(PERSONA_STORAGE_KEY);
      localStorage.removeItem("cybercode_user_goals");
    } catch { }

    // cleanup any cached roadmaps
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("cybercode_ai_roadmap_v"))
        .forEach((k) => localStorage.removeItem(k));
    } catch { }

    // gentle redirect to home
    window.location.href = "/";
  };

  // -------------------------
  // LESSON PROGRESS (local UI update + persist)
  // -------------------------
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    setCourseProgress((prev) => {
      const existing = prev?.[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
      const updatedLessons = Array.from(new Set([...(existing.completedLessons || []), lessonSlug]));
      const next = {
        ...prev,
        [courseSlug]: {
          completedLessons: updatedLessons,
          currentLessonIndex: updatedLessons.length,
          updatedAt: new Date().toISOString(),
        },
      };

      // try to persist via firestore/local hook
      try {
        firestore?.completeLessonFS?.(courseSlug, lessonSlug);
      } catch (e) {
        // ignore
      }

      return next;
    });
  };

  const isLessonCompleted = (courseSlug, lessonSlug) =>
    Boolean(courseProgress?.[courseSlug]?.completedLessons?.includes(lessonSlug));

  const getCourseCompletion = (courseSlug, totalLessons) => {
    const completed = courseProgress?.[courseSlug]?.completedLessons || [];
    if (!totalLessons) return 0;
    return Math.round((completed.length / totalLessons) * 100);
  };

  // -------------------------
  // PROVIDER
  // -------------------------
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

export const useUser = () => useContext(UserContext);
