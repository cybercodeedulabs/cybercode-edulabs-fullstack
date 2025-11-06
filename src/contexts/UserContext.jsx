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
    const storedCourses = localStorage.getItem("enrolledCourses");
    return storedCourses ? JSON.parse(storedCourses) : [];
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

  // Persist enrolled courses
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  // Persist course progress
  useEffect(() => {
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress));
  }, [courseProgress]);

  const enrollInCourse = (courseSlug) => {
    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses((prev) => [...prev, courseSlug]);
    }
  };

  // Sequential lesson completion
  const completeLesson = (courseSlug, lessonSlug) => {
    const lessons = lessonsData[courseSlug] || [];
    const courseData = courseProgress[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
    const nextLesson = lessons[courseData.completedLessons.length];

    if (nextLesson?.slug !== lessonSlug) return; // Only allow next lesson

    setCourseProgress({
      ...courseProgress,
      [courseSlug]: {
        completedLessons: [...courseData.completedLessons, lessonSlug],
        currentLessonIndex: courseData.currentLessonIndex + 1,
      },
    });
  };

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
        courseProgress,
        completeLesson,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
