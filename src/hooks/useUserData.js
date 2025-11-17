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
  const { user, enrolledCourses, setEnrolledCourses, activatePremium } = useUser();

  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
    isPremium: false,
  });

  // ============================================================
  // 🔥 Sync Firestore → React State → UserContext
  // ============================================================
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      // ⭐ Auto-create Firestore document for first-time users
      if (!snap.exists()) {
        await setDoc(
          ref,
          {
            enrolledCourses: [],
            projects: [],
            hasCertificationAccess: false,
            hasServerAccess: false,
            isPremium: false,
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
      });

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

  return {
    ...userData,
    enrolledCourses,
    enrollInCourse,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
  };
}
