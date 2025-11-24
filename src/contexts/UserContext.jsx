// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext();
const PERSONA_STORAGE_KEY = "cybercode_user_personas_v1";

export const UserProvider = ({ children }) => {
  // ----------------------
  // AUTH + BASIC USER STATE
  // ----------------------
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cybercodeUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  // 🔥 Listen to Firebase Auth
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

    return unsub;
  }, []);

  // ----------------------
  // Persona Engine
  // ----------------------
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
      const next = { ...prev };

      if (typeof obj === "string") {
        next[obj] = (next[obj] || 0) + delta;
      } else {
        Object.entries(obj).forEach(([p, v]) => {
          next[p] = (next[p] || 0) + (v || 0);
        });
      }

      localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const getTopPersona = () => {
    const e = Object.entries(personaScores || {});
    if (!e.length) return null;

    e.sort((a, b) => b[1] - a[1]);
    return { persona: e[0][0], score: e[0][1], all: e };
  };

  // ----------------------
  // Logout
  // ----------------------
  const logout = async () => {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,

        // Personas
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
