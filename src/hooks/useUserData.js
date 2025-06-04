// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";

export default function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    enrolledCourses: [],
    projects: [],
    hasCertificationAccess: false,
    hasServerAccess: false,
  });

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData({
          enrolledCourses: docSnap.data().enrolledCourses || [],
          projects: docSnap.data().projects || [],
          hasCertificationAccess: docSnap.data().hasCertificationAccess || false,
          hasServerAccess: docSnap.data().hasServerAccess || false,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 🟩 Enroll the user in a new course
  const enrollInCourse = async (courseSlug) => {
    if (!user) return;
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
    await updateDoc(userRef, {
      hasCertificationAccess: true,
    });
  };

  // 🟦 Grant 1-year server ac
