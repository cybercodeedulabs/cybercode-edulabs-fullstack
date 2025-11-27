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
 * Firestore syncing + all premium & analytics features
 *
 * NOTE:
 *  - NO useUser() imported (prevents circular deps)
 *  - UserContext passes user + setter callbacks
 *
 * Updated to support user goals.
 */
export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
  // If user not logged in => return empty feature set
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

  // ---------------------------------------------------------------------
  // SNAPSHOT LISTENER
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

    // Sync provider state
    if (setEnrolledCourses) setEnrolledCourses(data.enrolledCourses || []);
    if (setCourseProgress) setCourseProgress(data.courseProgress || {});

    // Sync premium flag into user object
    if (data.isPremium && setUser) setUser((u) => (u ? { ...u, isPremium: true } : u));

    // If goals are present in root user doc (optional fallback)
    if (data.goals && setUserGoals) {
      setUserGoals(data.goals);
    }
  });

  // ---------------------------------------------------------------------
  // GOALS: subcollection doc listener
  // ---------------------------------------------------------------------
  const goalsRef = doc(db, "users", user.uid, "goals", "main");
  onSnapshot(goalsRef, (snap) => {
    if (snap.exists()) {
      if (setUserGoals) setUserGoals(snap.data());
    } else {
      // no goals yet — set to null
      if (setUserGoals) setUserGoals(null);
    }
  });

  // =====================================================================
  // 🔵 1. ENROLL IN COURSE
  // =====================================================================
  const enrollInCourse = async (courseSlug) => {
    await updateDoc(ref, {
      enrolledCourses: arrayUnion(courseSlug),
    });
  };

  // =====================================================================
  // 🟢 2. COMPLETE LESSON (TRANSACTION)
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
  // 🟡 3. RECORD STUDY SESSION
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
  // 🔴 4. RESET MY PROGRESS
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
  // 🟣 5. PREMIUM ACCESS FUNCTIONS
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
  // 🟣 6. SAVE USER GOALS (subcollection)
  // =====================================================================
  const saveUserGoals = async (goals) => {
    // write to users/{uid}/goals/main
    await setDoc(goalsRef, {
      ...goals,
      updatedAt: Date.now(),
      createdAt: goals.createdAt || Date.now(),
    });
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
