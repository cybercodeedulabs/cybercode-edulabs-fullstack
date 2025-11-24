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
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const { user, enrolledCourses, setEnrolledCourses, activatePremium, setCourseProgress } =
    useUser();

  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
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

  // ===========================================================================
  // 🔥 Firestore Listener → Sync Everything
  // ===========================================================================
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
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

      setEnrolledCourses(data.enrolledCourses || []);
      setCourseProgress(data.courseProgress || {});

      if (data.isPremium) activatePremium();
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses, activatePremium, setCourseProgress]);

  // ===========================================================================
  // 🟩 Enroll In Course
  // ===========================================================================
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      enrolledCourses: arrayUnion(courseSlug),
    });
  };

  // ===========================================================================
  // 🔹 FIXED Study Session Recorder — Crash Proof
  // ===========================================================================
  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const today = new Date().toISOString().split("T")[0];

      // SAFE update — no serverTimestamp() inside arrayUnion
      await updateDoc(userRef, {
        [`courseProgress.${courseSlug}.timeSpentMinutes`]: increment(minutes),
        [`courseProgress.${courseSlug}.sessions`]: arrayUnion({
          lesson: lessonSlug,
          minutes,
          ts: Date.now(), // replace serverTimestamp
        }),
        "userStats.totalMinutes": increment(minutes),
        [`userStats.daily.${today}`]: increment(minutes),
        "userStats.lastStudyDate": today,
      });
    } catch (err) {
      console.error("🔥 recordStudySession FAILED", err);
    }
  };

  // ===========================================================================
  // 🟨 Premium / Certification
  // ===========================================================================
  const grantCertificationAccess = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      hasCertificationAccess: true,
      isPremium: true,
    });
    activatePremium();
  };

  const grantServerAccess = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      hasServerAccess: true,
      isPremium: true,
    });
    activatePremium();
  };

  const grantFullPremium = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
    });
    activatePremium();
  };

  // ===========================================================================
  // 🟥 Reset progress for current user
  // ===========================================================================
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

    setCourseProgress({});
  };

  // ===========================================================================
  // 🔥 FIXED — COMPLETE LESSON (Atomic Transaction)
  // ===========================================================================
  const completeLessonFS = async (courseSlug, lessonSlug, totalLessons) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

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
    });
  };

  return {
    ...userData,
    enrolledCourses,
    enrollInCourse,
    completeLessonFS,
    recordStudySession,
    resetMyProgress,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
  };
}
