// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const { user, enrolledCourses, setEnrolledCourses } = useUser();
  const [userData, setUserData] = useState({
    enrolledCourses: enrolledCourses || [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
  });

  // Sync Firestore data with local state
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          enrolledCourses: data.enrolledCourses || [],
          projects: data.projects || [],
          hasCertificationAccess: data.hasCertificationAccess || false,
          hasServerAccess: data.hasServerAccess || false,
        });

        // Also sync with context
        setEnrolledCourses(data.enrolledCourses || []);
      }
    });

    return () => unsubscribe();
  }, [user, setEnrolledCourses]);

  // 🟩 Enroll the user in a new course (updates context + Firestore)
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;

    // Update context state
    if (!enrolledCourses.includes(courseSlug)) {
      setEnrolledCourses([...enrolledCourses, courseSlug]);
    }

    // Update Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      { enrolledCourses: arrayUnion(courseSlug) },
      { merge: true }
    );
  };

  // 🟨 Grant certification access (after payment)
  const grantCertificationAccess = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { hasCertificationAccess: true });
  };

  // 🟦 Grant 1-year server access (after payment)
  const grantServerAccess = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { hasServerAccess: true });
  };

  return {
    ...userData,
    enrolledCourses,
    enrollInCourse,
    grantCertificationAccess,
    grantServerAccess,
  };
}
