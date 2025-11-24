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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const { user, enrolledCourses, setEnrolledCourses, activatePremium } = useUser();

  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
    isPremium: false,
    courseProgress: {}, // local mirror
    userStats: {
      totalMinutes: 0,
      daily: {}, // { "2025-11-24": 45 }
      streak: 0,
      lastStudyDate: "", // YYYY-MM-DD
    },
  });

  // ============================================================
  // 🔥 Sync Firestore → React State → UserContext
  // ============================================================
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      // Auto-create Firestore document for first-time users
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
        return; // wait for next snapshot
      }

      const data = snap.data();

      // Update local userData state
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

      // Sync enrolledCourses into UserContext
      setEnrolledCourses(data.enrolledCourses || []);

      // Sync premium flag only to context (NO FIRESTORE WRITE)
      if (data.isPremium) {
        activatePremium();
      }
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses, activatePremium]);

  // ============================================================
  // 🟩 Enroll In Course (Firestore)
  // ============================================================
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await updateDoc(
      ref,
      { enrolledCourses: arrayUnion(courseSlug) },
      { merge: true }
    );

    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses((prev) => [...prev, courseSlug]);
    }
  };

  // ============================================================
  // 🔹 Study Session Recorder (time tracking)
  // ============================================================
  /**
   * recordStudySession(courseSlug, lessonSlug, minutes)
   *
   * - Adds minutes to courseProgress.[courseSlug].timeSpentMinutes (increment)
   * - Appends a session to courseProgress.[courseSlug].sessions
   * - Updates userStats.totalMinutes, userStats.daily[today], userStats.streak, lastStudyDate
   */
  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const coursePathTime = `courseProgress.${courseSlug}.timeSpentMinutes`;
      const coursePathSessions = `courseProgress.${courseSlug}.sessions`;
      const userTotal = `userStats.totalMinutes`;
      const userDailyPath = `userStats.daily.${today}`;

      // Read current doc (to compute streak)
      const snap = await getDoc(userRef);
      const current = snap?.data() || {};
      const prevStats = current.userStats || {};
      const lastDate = prevStats.lastStudyDate || "";
      const prevStreak = prevStats.streak || 0;

      // compute new streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak = 1;
      if (lastDate === today) {
        newStreak = prevStreak; // same day, keep streak
      } else if (lastDate === yesterdayStr) {
        newStreak = prevStreak + 1;
      } else {
        newStreak = 1;
      }

      // Firestore update
      await updateDoc(userRef, {
        [coursePathTime]: increment(minutes),
        [coursePathSessions]: arrayUnion({
          lesson: lessonSlug,
          minutes,
          date: serverTimestamp(),
        }),
        [userTotal]: increment(minutes),
        [userDailyPath]: increment(minutes),
        "userStats.lastStudyDate": today,
        "userStats.streak": newStreak,
      });

      // local state update (optimistic)
      setUserData((prev) => {
        const updatedCourseProgress = {
          ...(prev.courseProgress || {}),
          [courseSlug]: {
            ...(prev.courseProgress?.[courseSlug] || {}),
            timeSpentMinutes:
              ((prev.courseProgress?.[courseSlug]?.timeSpentMinutes || 0) + minutes),
            sessions: [
              ...(prev.courseProgress?.[courseSlug]?.sessions || []),
              { lesson: lessonSlug, minutes, date: new Date().toISOString() },
            ],
          },
        };

        const updatedUserStats = {
          ...(prev.userStats || {}),
          totalMinutes: (prev.userStats?.totalMinutes || 0) + minutes,
          daily: {
            ...(prev.userStats?.daily || {}),
            [today]: ((prev.userStats?.daily?.[today] || 0) + minutes),
          },
          lastStudyDate: today,
          streak: newStreak,
        };

        return {
          ...prev,
          courseProgress: updatedCourseProgress,
          userStats: updatedUserStats,
        };
      });
    } catch (err) {
      console.error("Failed to record study session:", err);
    }
  };

  // ============================================================
  // 🟨 Grant Certification Access → also make Premium
  // ============================================================
  const grantCertificationAccess = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      hasCertificationAccess: true,
      isPremium: true,
    });

    activatePremium();
  };

  // ============================================================
  // 🟦 Grant Server Access → also make Premium
  // ============================================================
  const grantServerAccess = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      hasServerAccess: true,
      isPremium: true,
    });

    activatePremium();
  };

  // ============================================================
  // ⭐ Full Premium Access (Certification + Server)
  // ============================================================
  const grantFullPremium = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
    });

    activatePremium();
  };

  // ============================================================
  // ⚠️ Utility: reset progress for current user (useful for testing)
  // ============================================================
  const resetMyProgress = async () => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      courseProgress: {},
      enrolledCourses: [],
      userStats: {
        totalMinutes: 0,
        daily: {},
        streak: 0,
        lastStudyDate: "",
      },
    });
  };

  // ============================================================
  // Placeholder: server-side reset for all users (DO NOT CALL FROM CLIENT in production)
  // Implement server-side secure script or Cloud Function for this.
  // ============================================================
  const resetProgressForAllUsers = async () => {
    console.warn("resetProgressForAllUsers() should be implemented as a secure admin operation (Cloud Function).");
    // Example: call an admin endpoint here (not shown)
  };

  return {
    ...userData,
    enrolledCourses,
    enrollInCourse,
    recordStudySession,
    resetMyProgress,
    resetProgressForAllUsers,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
  };
}
