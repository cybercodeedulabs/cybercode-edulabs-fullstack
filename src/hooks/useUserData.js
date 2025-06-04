// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
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

    // Real-time listener
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

  return userData;
}
