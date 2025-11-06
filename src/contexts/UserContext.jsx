// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Load user from localStorage on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("cybercodeUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }, []);

  // Load enrolled courses from localStorage
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("enrolledCourses");
      if (savedCourses) {
        setEnrolledCourses(JSON.parse(savedCourses));
      }
    } catch (error) {
      console.error("Error loading enrolled courses:", error);
    }
  }, []);

  // Persist user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("cybercodeUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("cybercodeUser");
    }
  }, [user]);

  // Persist enrolled courses
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  // Function to enroll in a course
  const enrollInCourse = (courseSlug) => {
    if (!enrolledCourses.includes(courseSlug)) {
      const updatedCourses = [...enrolledCourses, courseSlug];
      setEnrolledCourses(updatedCourses);
      localStorage.setItem("enrolledCourses", JSON.stringify(updatedCourses));
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem("cybercodeUser");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        enrolledCourses,
        enrollInCourse,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => useContext(UserContext);
