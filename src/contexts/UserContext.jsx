// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import lessonsData from "../data/lessonsData";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("cybercodeUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const stored = localStorage.getItem("enrolledCourses");
    return stored ? JSON.parse(stored) : [];
  });

  const [courseProgress, setCourseProgress] = useState(() => {
    const storedProgress = localStorage.getItem("courseProgress");
    return storedProgress ? JSON.parse(storedProgress) : {};
  });

  const [loading, setLoading] = useState(true);

  // Firebase auth listener
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

  // Persist all data to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("cybercodeUser", JSON.stringify(user));
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress));
  }, [user, enrolledCourses, courseProgress]);

  // ✅ Enroll in a specific course
  const enrollInCourse = (courseSlug) => {
    if (!user) return; // must be logged in
    setEnrolledCourses((prev) => {
      const updated = prev.includes(courseSlug) ? prev : [...prev, courseSlug];
      localStorage.setItem("enrolledCourses", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Sequential lesson completion
  const completeLesson = (courseSlug, lessonSlug) => {
    const lessons = lessonsData[courseSlug] || [];
    const courseData = courseProgress[courseSlug] || {
      completedLessons: [],
      currentLessonIndex: 0,
    };
    const nextLesson = lessons[courseData.completedLessons.length];
    if (nextLesson?.slug !== lessonSlug) return;

    const updatedProgress = {
      ...courseProgress,
      [courseSlug]: {
        completedLessons: [...courseData.completedLessons, lessonSlug],
        currentLessonIndex: courseData.currentLessonIndex + 1,
      },
    };
    setCourseProgress(updatedProgress);
    localStorage.setItem("courseProgress", JSON.stringify(updatedProgress));
  };

  // ✅ Logout cleanup
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setEnrolledCourses([]);
    localStorage.removeItem("cybercodeUser");
    localStorage.removeItem("enrolledCourses");
    localStorage.removeItem("courseProgress");
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
        courseProgress,
        completeLesson,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
