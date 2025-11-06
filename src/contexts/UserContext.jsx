// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Load user instantly from localStorage (before Firebase initializes)
    const storedUser = localStorage.getItem("cybercodeUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const storedCourses = localStorage.getItem("enrolledCourses");
    return storedCourses ? JSON.parse(storedCourses) : [];
  });

  const [loading, setLoading] = useState(true);

  // ✅ Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          uid: firebaseUser.uid,
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

  // ✅ Persist enrolled courses
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const enrollInCourse = (courseSlug) => {
    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses((prev) => [...prev, courseSlug]);
    }
  };

  // ✅ Global logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("cybercodeUser");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
