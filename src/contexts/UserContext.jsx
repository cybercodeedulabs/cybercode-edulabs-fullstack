// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Auth state listener (handles refresh + redirect)
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

  // ✅ Restore user immediately on reload (before Firebase reinitializes)
  useEffect(() => {
    const storedUser = localStorage.getItem("cybercodeUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  // ✅ Course persistence
  useEffect(() => {
    const storedCourses = localStorage.getItem("enrolledCourses");
    if (storedCourses) setEnrolledCourses(JSON.parse(storedCourses));
  }, []);

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
