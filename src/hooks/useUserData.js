// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * useUserData(user, { setEnrolledCourses, setCourseProgress, activatePremium })
 *
 * NOTE: This hook intentionally does NOT import useUser to avoid circular deps.
 * It expects the caller (UserProvider) to pass user and setters it maintains.
 */
export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, activatePremium } = {}
) {
  const [userData, setUserData] = useState({
    enrolledCourses: [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
    isPremium: false,
    courseProgress: {},
    userStats: {
      totalMinutes: 0,
      daily: {},
      streak: 0,
      lastStudyDate: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        // create default doc for new users
        await setDoc(
          ref,
          {
            enrolledCourses: [],
            projects: [],
            hasCertificationAccess: false,
            hasServerAccess: false,
            isPremium: false,
            courseProgress: {},
            userStats: {
              totalMinutes: 0,
              daily: {},
              streak: 0,
              lastStudyDate: "",
            },
          },
          { merge: true }
        );
        return;
      }

      const data = snap.data();

      setUserData((prev) => ({
        ...prev,
        enrolledCourses: data.enrolledCourses || [],
        projects: data.projects || [],
        hasCertificationAccess: data.hasCertificationAccess || false,
        hasServerAccess: data.hasServerAccess || false,
        isPremium: data.isPremium || false,
        courseProgress: data.courseProgress || {},
        userStats: data.userStats || prev.userStats,
      }));

      // update the provider's local state via setter callbacks if provided
      if (typeof setEnrolledCourses === "function") {
        setEnrolledCourses(data.enrolledCourses || []);
      }
      if (typeof setCourseProgress === "function") {
        setCourseProgress(data.courseProgress || {});
      }

      if (data.isPremium && typeof activatePremium === "function") {
        activatePremium();
      }
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses, setCourseProgress, activatePremium]);

  // Enroll in course (updates Firestore)
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    try {
      await updateDoc(ref, {
        enrolledCourses: arrayUnion(courseSlug),
      });

      // optimistic local update (provider will also sync via snapshot)
      if (typeof setEnrolledCourses === "function") {
        setEnrolledCourses((prev = []) => (prev.includes(courseSlug) ? prev : [...prev, courseSlug]));
      }
    } catch (err) {
      console.error("enrollInCourse failed:", err);
      throw err;
    }
  };

  // Safe study-session recorder (avoid serverTimestamp inside arrayUnion)
  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const today = new Date().toISOString().split("T")[0];

      await updateDoc(userRef, {
        [`courseProgress.${courseSlug}.timeSpentMinutes`]: increment(minutes),
        // use client ts to avoid serverTimestamp inside arrayUnion problems
        [`courseProgress.${courseSlug}.sessions`]: arrayUnion({
          lesson: lessonSlug,
          minutes,
          ts: Date.now(),
        }),
        "userStats.totalMinutes": increment(minutes),
        [`userStats.daily.${today}`]: increment(minutes),
        "userStats.lastStudyDate": today,
      });
    } catch (err) {
      console.error("recordStudySession failed:", err);
    }
  };

  const grantCertificationAccess = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      hasCertificationAccess: true,
      isPremium: true,
    });
    if (typeof activatePremium === "function") activatePremium();
  };

  const grantServerAccess = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      hasServerAccess: true,
      isPremium: true,
    });
    if (typeof activatePremium === "function") activatePremium();
  };

  const grantFullPremium = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
    });
    if (typeof activatePremium === "function") activatePremium();
  };

  const resetMyProgress = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      courseProgress: {},
      userStats: {
        totalMinutes: 0,
        daily: {},
        streak: 0,
        lastStudyDate: "",
      },
    });
    if (typeof setCourseProgress === "function") setCourseProgress({});
  };

  // Atomic complete lesson using transaction
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        const data = snap.data() || {};
        const course = data.courseProgress?.[courseSlug] || {};
        const completed = new Set(course.completedLessons || []);

        completed.add(lessonSlug);

        const newCompleted = Array.from(completed);
        const newIndex = newCompleted.length;

        tx.update(userRef, {
          [`courseProgress.${courseSlug}.completedLessons`]: newCompleted,
          [`courseProgress.${courseSlug}.currentLessonIndex`]: newIndex,
          [`courseProgress.${courseSlug}.updatedAt`]: Date.now(),
        });

        // optimistic local update after transaction success is handled by snapshot listener
      });
    } catch (err) {
      console.error("completeLessonFS transaction failed:", err);
      throw err;
    }
  };

  return {
    ...userData,
    enrollInCourse,
    completeLessonFS,
    recordStudySession,
    resetMyProgress,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
  };
}
