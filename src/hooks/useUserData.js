// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const {
    user,
    enrolledCourses,
    setEnrolledCourses,
    activatePremium,
    setCourseProgress, // new: setter from context
  } = useUser();

  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
    isPremium: false,
    courseProgress: {},
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
          },
          { merge: true }
        );
        return; // wait for next snapshot
      }

      const data = snap.data();

      // Update local userData state
      setUserData({
        enrolledCourses: data.enrolledCourses || [],
        projects: data.projects || [],
        hasCertificationAccess: data.hasCertificationAccess || false,
        hasServerAccess: data.hasServerAccess || false,
        isPremium: data.isPremium || false,
        courseProgress: data.courseProgress || {},
      });

      // Sync enrolledCourses into UserContext
      setEnrolledCourses(data.enrolledCourses || []);

      // Sync courseProgress into UserContext (so components reading useUser() see it)
      if (typeof setCourseProgress === "function") {
        setCourseProgress(data.courseProgress || {});
      }

      // Sync premium flag only to context (NO FIRESTORE WRITE)
      if (data.isPremium) {
        activatePremium();
      }
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses, activatePremium, setCourseProgress]);

  // ============================================================
  // 🟩 Enroll In Course
  // ============================================================
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    await setDoc(
      ref,
      { enrolledCourses: arrayUnion(courseSlug) },
      { merge: true }
    );

    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses((prev) => [...prev, courseSlug]);
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
  // 🔁 Complete lesson (Firestore-backed)
  // ============================================================
  const completeLessonFS = async (courseSlug, lessonSlug, lessonsLength = null) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    // read current snapshot (we could also rely on local userData.courseProgress)
    // but to be safe, read from our local userData state
    const currentProgress = userData.courseProgress?.[courseSlug] || {
      completedLessons: [],
      currentLessonIndex: 0,
    };

    // Avoid duplicates
    if (currentProgress.completedLessons.includes(lessonSlug)) return;

    const updated = {
      completedLessons: [...currentProgress.completedLessons, lessonSlug],
      currentLessonIndex: (currentProgress.currentLessonIndex || 0) + 1,
    };

    // Write merged object under courseProgress.<slug>
    try {
      await updateDoc(ref, {
        [`courseProgress.${courseSlug}`]: updated,
      });

      // Also update local context state immediately (optimistic UI)
      if (typeof setCourseProgress === "function") {
        setCourseProgress((prev) => {
          const next = { ...(prev || {}) };
          next[courseSlug] = updated;
          // persist to localStorage as before to keep current behavior when offline
          try {
            localStorage.setItem("courseProgress", JSON.stringify(next));
          } catch (e) {
            // ignore storage errors
          }
          return next;
        });
      }

      // Auto unlock certificate if we've completed all lessons for this course
      // if lessonsLength provided, compare; otherwise we rely on updated.completedLessons
      const completedCount = updated.completedLessons.length;
      const totalLessons = typeof lessonsLength === "number" ? lessonsLength : null;

      if (totalLessons && completedCount >= totalLessons) {
        // set hasCertificationAccess true
        await updateDoc(ref, { hasCertificationAccess: true });
      }
    } catch (err) {
      console.error("Failed to update course progress in Firestore", err);
      // fallback: update local progress only
      if (typeof setCourseProgress === "function") {
        setCourseProgress((prev) => {
          const next = { ...(prev || {}) };
          next[courseSlug] = updated;
          try {
            localStorage.setItem("courseProgress", JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
    }
  };

  return {
    ...userData,
    enrolledCourses,
    enrollInCourse,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
    completeLessonFS, // new
  };
}
