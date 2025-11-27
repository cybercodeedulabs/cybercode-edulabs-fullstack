// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";

export const UserProvider = ({ children }) => {
  // AUTH USER (cached)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // User goals
  const [userGoals, setUserGoals] = useState(null);

  // -----------------------------------------------------
  // 🔵 AUTH LISTENER (Google login session)
  // -----------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
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
      } else {
        setUser(null);
        localStorage.removeItem("cybercodeUser");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // -----------------------------------------------------
  // LOCAL STATE synced from Firestore
  // -----------------------------------------------------
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // -----------------------------------------------------
  // PERSONA ENGINE
  // -----------------------------------------------------
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
        Object.entries(obj).forEach(([k, v]) => {
          next[k] = (next[k] || 0) + (v || 0);
        });
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
  // FIRESTORE HOOK (now includes setUserGoals)
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

  // make saveUserGoals available via context (if returned by hook)
  const saveUserGoals = firestore.saveUserGoals;

  // -----------------------------------------------------
  // ENROLL WRAPPER
  // -----------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    setEnrolledCourses((prev) => (prev.includes(courseSlug) ? prev : [...prev, courseSlug]));

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
    localStorage.clear();
    window.location.href = "/";
  };

  // -----------------------------------------------------
  // CONTEXT VALUE
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

        ...firestore,

        personaScores,
        updatePersonaScore,
        getTopPersona,

        userGoals,
        setUserGoals,
        saveUserGoals,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
