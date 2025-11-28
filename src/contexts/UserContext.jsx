// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();

// ----------------------------
// CONSTANTS
// ----------------------------
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1";

export const UserProvider = ({ children }) => {
  // -----------------------------------------------------
  // AUTH USER (cache load)
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
  // AI-GENERATED PROJECTS
  // -----------------------------------------------------
  const [generatedProjects, setGeneratedProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  });

  /** Load projects from Firestore + merge local */
  const loadGeneratedProjects = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      const cloudProjects =
        snap.exists() && snap.data().generatedProjects
          ? snap.data().generatedProjects
          : [];

      const localProjects =
        JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];

      // merge unique
      const merged = [
        ...localProjects,
        ...cloudProjects.filter(
          (cp) => !localProjects.some((lp) => lp.id === cp.id)
        ),
      ];

      setGeneratedProjects(merged);
      localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(merged));

      // sync back to Firestore if mismatched
      if (merged.length !== cloudProjects.length) {
        await updateDoc(ref, { generatedProjects: merged });
      }
    } catch (err) {
      console.error("Failed loading generated projects:", err);
    }
  };

  /** Save new project (local + Firestore) */
  const saveGeneratedProject = async (project) => {
    try {
      const withId = {
        ...project,
        id: project.id || crypto.randomUUID(),
        timestamp: Date.now(),
      };

      // save locally
      setGeneratedProjects((prev) => {
        const next = [...prev, withId];
        localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        return next;
      });

      // save in Firestore
      if (user?.uid) {
        const ref = doc(db, "users", user.uid);

        await setDoc(
          ref,
          {
            generatedProjects: [...generatedProjects, withId],
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      return withId;
    } catch (err) {
      console.error("Saving generated project failed:", err);
    }
  };

  // -----------------------------------------------------
  // AUTH LISTENER
  // -----------------------------------------------------
  useEffect(() => {
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

        // Load AI-generated projects
        await loadGeneratedProjects(firebaseUser.uid);
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
  // FIRESTORE HOOK
  // -----------------------------------------------------
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser: (updater) => {
      setUser((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        const merged = { ...prev, ...next };
        localStorage.setItem("cybercodeUser", JSON.stringify(merged));
        return merged;
      });
    },
    setUserGoals,
  });

  const saveUserGoals = firestore.saveUserGoals;

  // -----------------------------------------------------
  // COURSE ENROLL WRAPPER (FIXED)
  // -----------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    if (!user?.uid) return;

    setEnrolledCourses((prev) =>
      prev.includes(courseSlug) ? prev : [...prev, courseSlug]
    );

    try {
      await firestore.enrollInCourse(courseSlug);
    } catch (err) {
      console.error("Enroll failed:", err);
    }
  };

  // -----------------------------------------------------
  // LOGOUT
  // -----------------------------------------------------
  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);

    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem(GENERATED_PROJECTS_KEY);
    localStorage.removeItem(PERSONA_STORAGE_KEY);

    // remove any cached roadmaps
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cybercode_ai_roadmap_v1"))
      .forEach((k) => localStorage.removeItem(k));

    window.location.href = "/";
  };
  // -----------------------------------------------------
  // LESSON PROGRESS MANAGEMENT (RESTORED & COMPATIBLE)
  // -----------------------------------------------------

  /**
   * Mark a lesson as complete.
   * Saves locally + Firestore.
   * (Name preserved for backward compatibility in CourseDetail & LessonDetail)
   */
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    try {
      // Update local state immediately
      setCourseProgress((prev) => {
        const existing = prev[courseSlug] || { completedLessons: [] };

        const updatedLessons = Array.from(
          new Set([...existing.completedLessons, lessonSlug])
        );

        return {
          ...prev,
          [courseSlug]: { completedLessons: updatedLessons },
        };
      });

      // Persist to Firestore
      if (user?.uid) {
        const ref = doc(db, "users", user.uid);

        const previousLessons =
          courseProgress?.[courseSlug]?.completedLessons || [];

        const updatedFromFS = Array.from(
          new Set([...previousLessons, lessonSlug])
        );

        await setDoc(
          ref,
          {
            courseProgress: {
              ...(courseProgress || {}),
              [courseSlug]: {
                completedLessons: updatedFromFS,
              },
            },
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("completeLessonFS failed:", err);
    }
  };

  /** Check if a lesson is completed */
  const isLessonCompleted = (courseSlug, lessonSlug) => {
    return (
      courseProgress?.[courseSlug]?.completedLessons?.includes(
        lessonSlug
      ) || false
    );
  };

  /** Get completion percentage */
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
        saveGeneratedProject,
        loadGeneratedProjects,
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
