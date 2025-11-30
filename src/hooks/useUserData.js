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

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
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

  // ---------------------------------------------------------
  // SNAPSHOT LISTENERS (SAFE - WITH CLEANUP)
  // ---------------------------------------------------------
  const unsubUser = onSnapshot(ref, async (snap) => {
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

    if (setEnrolledCourses)
      setEnrolledCourses(data.enrolledCourses || []);

    if (setCourseProgress)
      setCourseProgress(data.courseProgress || {});

    if (data.isPremium && setUser)
      setUser((u) => (u ? { ...u, isPremium: true } : u));

    if (data.goals && setUserGoals)
      setUserGoals(data.goals);
  });

  const unsubGoals = onSnapshot(goalsRef, (snap) => {
    if (snap.exists()) {
      if (setUserGoals) setUserGoals(snap.data());
    } else {
      if (setUserGoals) setUserGoals(null);
    }
  });

  // Cleanup function (prevents memory leak)
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      unsubUser();
      unsubGoals();
    });
  }

  // ---------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    await updateDoc(ref, { enrolledCourses: arrayUnion(courseSlug) });
  };

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
