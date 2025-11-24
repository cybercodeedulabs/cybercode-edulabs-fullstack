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
  { setEnrolledCourses, setCourseProgress, setUser }
) {
  if (!user) return {};

  const ref = doc(db, "users", user.uid);

  // -------------------------------------------------------
  // SNAPSHOT LISTENER
  // -------------------------------------------------------
  onSnapshot(ref, async (snap) => {
    if (!snap.exists()) {
      await setDoc(
        ref,
        {
          enrolledCourses: [],
          courseProgress: {},
          projects: [],
          isPremium: false,
          hasCertificationAccess: false,
          hasServerAccess: false,
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
  });

  // -------------------------------------------------------
  // ENROLL
  // -------------------------------------------------------
  const enrollInCourse = async (courseSlug) => {
    await updateDoc(ref, {
      enrolledCourses: arrayUnion(courseSlug),
    });
  };

  // -------------------------------------------------------
  // COMPLETE LESSON
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  return {
    enrollInCourse,
    completeLessonFS,
  };
}
