// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import useUserData from "../hooks/useUserData";

const UserContext = createContext();

// ----------------------------
// CONSTANTS
// ----------------------------
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";
const GENERATED_PROJECTS_KEY = "cybercode_generated_projects_v1"; // NEW KEY


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

  /** ================================
   * 🔵 AI-Generated Projects State
   * ================================= */
  const [generatedProjects, setGeneratedProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(GENERATED_PROJECTS_KEY)) || [];
    } catch {
      return [];
    }
  });

  /** ================================
   * 🟣 Load & sync generated projects
   * ================================= */
  const loadGeneratedProjects = async (uid) => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      const cloudProjects = snap.exists()
        ? snap.data().generatedProjects || []
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

      // Update local state + save
      setGeneratedProjects(merged);
      localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(merged));

      // sync back to Firestore if needed
      if (merged.length !== cloudProjects.length) {
        await updateDoc(ref, { generatedProjects: merged });
      }
    } catch (err) {
      console.error("Failed loading generated projects:", err);
    }
  };

  /** ================================
   * 🟢 Save new generated project
   * ================================= */
  const saveGeneratedProject = async (project) => {
    try {
      const withId = {
        ...project,
        id: project.id || crypto.randomUUID(),
        timestamp: Date.now(),
      };

      // Update local state
      setGeneratedProjects((prev) => {
        const next = [...prev, withId];
        localStorage.setItem(GENERATED_PROJECTS_KEY, JSON.stringify(next));
        return next;
      });

      // Sync to Firestore
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


  /** ================================
   * 🔵 AUTH LISTENER
   * ================================= */
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

        // Load AI projects (local + cloud)
        await loadGeneratedProjects(firebaseUser.uid);

      } else {
        // logout state
        setUser(null);
        localStorage.removeItem("cybercodeUser");
        localStorage.removeItem(GENERATED_PROJECTS_KEY);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /** ================================
   * 🔵 User goals, persona, etc.
   * =================================*/
  const [userGoals, setUserGoals] = useState(null);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});

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


  /** ================================
   * 🔵 FIRESTORE HOOK
   * =================================*/
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


  /** ================================
   * LOGOUT
   * =================================*/
  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);

    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem(GENERATED_PROJECTS_KEY);
    localStorage.removeItem(PERSONA_STORAGE_KEY);

    // remove roadmap cache
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cybercode_ai_roadmap_v1"))
      .forEach((k) => localStorage.removeItem(k));

    window.location.href = "/";
  };


  /** ================================
   * PROVIDER VALUE
   * =================================*/
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,

        enrolledCourses,
        enrollInCourse: firestore.enrollInCourse,

        courseProgress,
        setCourseProgress,

        personaScores,
        updatePersonaScore,
        getTopPersona,

        userGoals,
        setUserGoals,
        saveUserGoals,

        // NEW → AI Generated Projects API
        generatedProjects,
        saveGeneratedProject,
        loadGeneratedProjects,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
