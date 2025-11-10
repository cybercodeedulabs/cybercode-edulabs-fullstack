// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cybercodeUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem("cybercodeUserRole");
    return stored ? stored : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const storedCourses = localStorage.getItem("enrolledCourses");
    return storedCourses ? JSON.parse(storedCourses) : [];
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || "/images/default-avatar.png",
        };

        setUser(userData);
        localStorage.setItem("cybercodeUser", JSON.stringify(userData));

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const d = snap.data();
            if (d?.role) {
              setRole(d.role);
              localStorage.setItem("cybercodeUserRole", d.role);
            } else {
              setRole(null);
              localStorage.removeItem("cybercodeUserRole");
            }

            if (d?.photo) {
              setUser((prev) => {
                const next = { ...prev, photo: d.photo };
                localStorage.setItem("cybercodeUser", JSON.stringify(next));
                return next;
              });
            }
          } else {
            setRole(null);
            localStorage.removeItem("cybercodeUserRole");
          }
        } catch (err) {
          console.error("Failed to read user role:", err);
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("cybercodeUser");
        localStorage.removeItem("cybercodeUserRole");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const enrollInCourse = (courseSlug) => {
    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses((prev) => [...prev, courseSlug]);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("SignOut warning (non-critical):", e);
    }

    // Clear both normal and IAM-related keys safely
    const keysToRemove = [
      "cybercodeUser",
      "cybercodeUserRole",
      "enrolledCourses",
      "iamUser",
      "iamSession",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    setUser(null);
    setRole(null);
  };

  const isConsoleUser = () => !!role;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        isConsoleUser,
        logout,
        enrolledCourses,
        enrollInCourse,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
