// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import lessonsData from "../data/lessonsData";

const UserContext = createContext();
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";

export const UserProvider = ({ children }) => {
  // ------------------------------------
  // USER + PREMIUM STATE
  // ------------------------------------
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cybercodeUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const stored = localStorage.getItem("enrolledCourses");
    return stored ? JSON.parse(stored) : [];
  });

  const [courseProgress, setCourseProgress] = useState(() => {
    const stored = localStorage.getItem("courseProgress");
    return stored ? JSON.parse(stored) : {};
  });

  const [loading, setLoading] = useState(true);

  // ====================================================
  // 🔥 AUTH LISTENER — Sync Firebase User → Local State
  // ====================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Keep previous premium status from local storage
        const stored = JSON.parse(localStorage.getItem("cybercodeUser")) || {};

        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,

          // ⭐ No auto-premium — only respect stored
          isPremium: stored.isPremium || false,
        };

        setUser(userData);
        localStorage.setItem("cybercodeUser", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("cybercodeUser");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ====================================================
  // 🔄 Persist State
  // ====================================================
  useEffect(() => {
    if (user) localStorage.setItem("cybercodeUser", JSON.stringify(user));
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress));
  }, [user, enrolledCourses, courseProgress]);

  // ====================================================
  // 🟩 LOCAL Enroll in Course (Firestore updates happen in useUserData)
  // ====================================================
  const enrollInCourse = (courseSlug) => {
    if (!user) return;

    setEnrolledCourses((prev) => {
      const updated = prev.includes(courseSlug) ? prev : [...prev, courseSlug];
      localStorage.setItem("enrolledCourses", JSON.stringify(updated));
      return updated;
    });
  };

  // ====================================================
  // 🧠 Persona Engine
  // ====================================================
  const [personaScores, setPersonaScores] = useState(() => {
    try {
      const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const updatePersonaScore = (personaOrObj, delta = 0) => {
    setPersonaScores((prev) => {
      const next = { ...(prev || {}) };

      if (typeof personaOrObj === "string") {
        next[personaOrObj] = (next[personaOrObj] || 0) + delta;
      } else if (typeof personaOrObj === "object") {
        Object.entries(personaOrObj).forEach(([p, v]) => {
          next[p] = (next[p] || 0) + (v || 0);
        });
      }

      localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getTopPersona = () => {
    const entries = Object.entries(personaScores || {});
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { persona: entries[0][0], score: entries[0][1], all: entries };
  };

  // ====================================================
  // 📘 Lesson Completion - keep local wrapper (deprecated)
  // ====================================================
  // Note: new Firestore-backed completion is implemented in useUserData()
  // This local function can remain for offline/demo fallback.
  const completeLesson = (courseSlug, lessonSlug) => {
    const lessons = lessonsData[courseSlug] || [];
    const courseData = courseProgress[courseSlug] || {
      completedLessons: [],
      currentLessonIndex: 0,
    };

    const nextLesson = lessons[courseData.completedLessons.length];
    if (nextLesson?.slug !== lessonSlug) return;

    const updated = {
      ...courseProgress,
      [courseSlug]: {
        completedLessons: [...courseData.completedLessons, lessonSlug],
        currentLessonIndex: courseData.currentLessonIndex + 1,
      },
    };

    setCourseProgress(updated);
    localStorage.setItem("courseProgress", JSON.stringify(updated));
  };

  // ====================================================
  // ⭐ PREMIUM ACTIVATION (LOCAL ONLY)
  // ====================================================
  const activatePremium = () => {
    setUser((prev) => {
      if (!prev) return prev; // safety

      const updated = { ...prev, isPremium: true };
      localStorage.setItem("cybercodeUser", JSON.stringify(updated));
      return updated;
    });
  };

  // ====================================================
  // 🔴 Logout
  // ====================================================
  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem("enrolledCourses");
    localStorage.removeItem("courseProgress");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,

        enrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress, // <--- newly exposed setter

        completeLesson, // local fallback
        // Note: Firestore-backed completion is available via useUserData().completeLessonFS

        personaScores,
        updatePersonaScore,
        getTopPersona,

        loading,

        // ⭐ premium now stable
        activatePremium,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
