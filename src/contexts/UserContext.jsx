// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";

export const UserProvider = ({ children }) => {
  // -------------------------------------------------------
  // AUTH USER
  // -------------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("cybercodeUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
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

    return () => unsub();
  }, []);

  // -------------------------------------------------------
  // LOCAL PROVIDER STATE (Synced via Firestore)
  // -------------------------------------------------------
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

  // -------------------------------------------------------
  // PERSONA ENGINE
  // -------------------------------------------------------
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
    const e = Object.entries(personaScores);
    if (!e.length) return null;
    e.sort((a, b) => b[1] - a[1]);
    return { persona: e[0][0], score: e[0][1], all: e };
  };

  // -------------------------------------------------------
  // HOOK: FIRESTORE SYNC
  // -------------------------------------------------------
  const firestore = useUserData(user, {
    setEnrolledCourses,
    setCourseProgress,
    setUser,
  });

  // -------------------------------------------------------
  // ENROLL: Local + Firestore
  // -------------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    setEnrolledCourses((prev) =>
      prev.includes(courseSlug) ? prev : [...prev, courseSlug]
    );

    try {
      await firestore.enrollInCourse(courseSlug);
    } catch (err) {
      console.error("Enroll failed:", err);
    }
  };

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        logout,

        enrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress,

        // Firestore functions
        ...firestore,

        // Persona
        personaScores,
        updatePersonaScore,
        getTopPersona,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
