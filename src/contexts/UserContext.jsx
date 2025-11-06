import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // User info
  const [user, setUser] = useState(null);

  // Courses the user is enrolled in
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Load user from localStorage if available
useEffect(() => {
  const storedUser = localStorage.getItem("cybercodeUser");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

  // Load enrolled courses from localStorage if available
  useEffect(() => {
    const storedCourses = localStorage.getItem("enrolledCourses");
    if (storedCourses) {
      setEnrolledCourses(JSON.parse(storedCourses));
    }
  }, []);

  // Save enrolled courses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  // Function to enroll in a course
  const enrollInCourse = (courseSlug) => {
    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses([...enrolledCourses, courseSlug]);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        enrolledCourses,
        storedUser,
        enrollInCourse,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access
export const useUser = () => useContext(UserContext);
