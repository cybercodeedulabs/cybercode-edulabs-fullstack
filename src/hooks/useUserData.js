// src/hooks/useUserData.js
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * useUserData
 * Firestore syncing + premium + analytics + goals
 *
 * IMPORTANT:
 * - This file NEVER imports useUser() to avoid circular dependency.
 * - All setters come from UserContext.
 */
export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
  // If no user, return empty stubs
  if (!user) {
    return {
      enrollInCourse: async () => {},
      completeLessonFS: async () => {},
      recordStudySession: async () => {},
      resetMyProgress: async () => {},
      grantCertificationAccess: async () => {},
      grantServerAccess: async () => {},
      grantFullPremium: async () => {},
      saveUserGoals: async () => {},
    };
  }

  const ref = doc(db, "users", user.uid);
  const goalsRef = doc(db, "users", user.uid, "goals", "main");

  // ---------------------------------------------------------------------
  // USER ROOT SNAPSHOT
  // ---------------------------------------------------------------------
  onSnapshot(ref, async (snap) => {
    if (!snap.exists()) {
      await setDoc(
        ref,
        {
          enrolledCourses: [],
          projects: [],
          isPremium: false,
          hasCertificationAccess: false,
          hasServerAccess: false,
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

    // Sync courses
    if (setEnrolledCourses)
      setEnrolledCourses(data.enrolledCourses || []);

    // Sync progress
    if (setCourseProgress)
      setCourseProgress(data.courseProgress || {});

    // Sync premium
    if (data.isPremium && setUser)
      setUser((u) => (u ? { ...u, isPremium: true } : u));

    // Optional fallback if goals are stored at root
    if (data.goals && setUserGoals)
      setUserGoals(data.goals);
  });

  // ---------------------------------------------------------------------
  // GOALS SNAPSHOT (MAIN SOURCE OF TRUTH)
  // ---------------------------------------------------------------------
  onSnapshot(goalsRef, (snap) => {
    if (snap.exists()) {
      if (setUserGoals) setUserGoals(snap.data());
    } else {
      if (setUserGoals) setUserGoals(null);
    }
  });

  // =====================================================================
  // 1. ENROLL IN COURSE
  // =====================================================================
  const enrollInCourse = async (courseSlug) => {
    await updateDoc(ref, {
      enrolledCourses: arrayUnion(courseSlug),
    });
  };

  // =====================================================================
  // 2. COMPLETE LESSON (TRANSACTION)
  // =====================================================================
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.data() || {};
      const course = data.courseProgress?.[courseSlug] || {};

      const completed = new Set(course.completedLessons || []);
      completed.add(lessonSlug);

      tx.update(ref, {
        [`courseProgress.${courseSlug}.completedLessons`]: [...completed],
        [`courseProgress.${courseSlug}.currentLessonIndex`]: completed.size,
        [`courseProgress.${courseSlug}.updatedAt`]: Date.now(),
      });
    });
  };

  // =====================================================================
  // 3. RECORD STUDY SESSION
  // =====================================================================
  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    const today = new Date().toISOString().split("T")[0];

    await updateDoc(ref, {
      [`courseProgress.${courseSlug}.timeSpentMinutes`]: increment(minutes),
      [`courseProgress.${courseSlug}.sessions`]: arrayUnion({
        lesson: lessonSlug,
        minutes,
        ts: Date.now(),
      }),
      "userStats.totalMinutes": increment(minutes),
      [`userStats.daily.${today}`]: increment(minutes),
      "userStats.lastStudyDate": today,
    });
  };

  // =====================================================================
  // 4. RESET ALL PROGRESS
  // =====================================================================
  const resetMyProgress = async () => {
    await updateDoc(ref, {
      courseProgress: {},
      userStats: {
        totalMinutes: 0,
        daily: {},
        streak: 0,
        lastStudyDate: "",
      },
    });

    if (setCourseProgress) setCourseProgress({});
  };

  // =====================================================================
  // 5. PREMIUM ACCESS
  // =====================================================================
  const grantCertificationAccess = async () => {
    await updateDoc(ref, {
      hasCertificationAccess: true,
      isPremium: true,
    });
  };

  const grantServerAccess = async () => {
    await updateDoc(ref, {
      hasServerAccess: true,
      isPremium: true,
    });
  };

  const grantFullPremium = async () => {
    await updateDoc(ref, {
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
    });
  };

  // =====================================================================
  // 6. SAVE USER GOALS (MAIN LOGIC)
  // =====================================================================
  const saveUserGoals = async (goals) => {
    await setDoc(
      goalsRef,
      {
        ...goals,
        updatedAt: Date.now(),
        createdAt: goals.createdAt || Date.now(),
      },
      { merge: true }
    );

    if (setUserGoals) setUserGoals(goals);
  };

  // =====================================================================
  // RETURN EVERYTHING
  // =====================================================================
  return {
    enrollInCourse,
    completeLessonFS,
    recordStudySession,
    resetMyProgress,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
    saveUserGoals,
  };
}
