// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";

export const UserProvider = ({ children }) => {
  // --------------------------------------------------------
  // BASIC USER (AUTH)
  // --------------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const stored = JSON.parse(localStorage.getItem("cybercodeUser")) || {};

        const u = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          isPremium: stored.isPremium || false,
        };

        setUser(u);
        localStorage.setItem("cybercodeUser", JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem("cybercodeUser");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --------------------------------------------------------
  // LOCAL STATE (kept in context)
  // --------------------------------------------------------
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // --------------------------------------------------------
  // PERSONA ENGINE (Local Only)
  // --------------------------------------------------------
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
    const entries = Object.entries(personaScores || {});
    if (!entries.length) return null;

    entries.sort((a, b) => b[1] - a[1]);
    return { persona: entries[0][0], score: entries[0][1], all: entries };
  };

  // --------------------------------------------------------
  // PREMIUM FLAG LOCAL ONLY
  // --------------------------------------------------------
  const activatePremium = () => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, isPremium: true };
      localStorage.setItem("cybercodeUser", JSON.stringify(updated));
      return updated;
    });
  };

  // --------------------------------------------------------
  // FIRESTORE-HOOK (NO circular import)
  // --------------------------------------------------------
  const firestoreFunctions = useUserData({
    user,
    setEnrolledCourses,
    setCourseProgress,
    activatePremium,
  });

  // --------------------------------------------------------
  // ENROLL (local + Firestore)
  // --------------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    // local
    setEnrolledCourses((prev) => {
      if (!prev.includes(courseSlug)) {
        return [...prev, courseSlug];
      }
      return prev;
    });

    // firestore
    try {
      await firestoreFunctions.enrollInCourse(courseSlug);
    } catch (e) {
      console.error("Firestore enrollment failed:", e);
    }
  };

  // --------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    localStorage.clear(); // keeps persona if you want
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,

        enrolledCourses,
        setEnrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress,

        ...firestoreFunctions,

        personaScores,
        updatePersonaScore,
        getTopPersona,

        activatePremium,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
