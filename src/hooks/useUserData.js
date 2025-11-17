// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const { user, enrolledCourses, setEnrolledCourses, activatePremium } = useUser();

  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
    isPremium: false, // NEW
  });

  // ============================================================
  // 🔥 Sync Firestore user doc with React state
  // ============================================================
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setUserData({
          enrolledCourses: data.enrolledCourses || [],
          projects: data.projects || [],
          hasCertificationAccess: data.hasCertificationAccess || false,
          hasServerAccess: data.hasServerAccess || false,
          isPremium: data.isPremium || false, // sync premium status
        });

        // Also sync with context store
        if (data.isPremium) {
          activatePremium(); // keep UserContext always in sync
        }

        setEnrolledCourses(data.enrolledCourses || []);
      }
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses, activatePremium]);

  // ============================================================
  // 🟩 Enroll In Course
  // ============================================================
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses([...enrolledCourses, courseSlug]);
    }

    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      { enrolledCourses: arrayUnion(courseSlug) },
      { merge: true }
    );
  };

  // ============================================================
  // 🟨 Grant Certification Access
  // ============================================================
  const grantCertificationAccess = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { hasCertificationAccess: true, isPremium: true });

    // Also update local premium flag
    activatePremium();
  };

  // ============================================================
  // 🟦 Grant Server Access
  // ============================================================
  const grantServerAccess = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { hasServerAccess: true, isPremium: true });

    // Keep context premium consistent
    activatePremium();
  };

  // ============================================================
  // ⭐ NEW — Grant Full Premium Access
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
    grantFullPremium, // NEW
  };
}
