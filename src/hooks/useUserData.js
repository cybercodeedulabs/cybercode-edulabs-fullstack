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
 *
 * Fixes:
 * - Prevents duplicate onSnapshot listeners by registering listeners once per user uid.
 * - Debounces/ignores duplicate snapshot data updates to avoid excessive setState.
 * - Cleans up listeners on page unload.
 */

// Module-level bookkeeping to avoid duplicate listeners and re-renders
const activeListeners = new Map(); // uid -> { unsubRoot, unsubGoals, lastRootHash, lastGoalsHash }

/** Simple stable stringify for shallow change detection */
function hashObj(obj) {
  try {
    return JSON.stringify(obj || {});
  } catch {
    return String(obj);
  }
}

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
  // If no user, return empty stubs
  if (!user || !user.uid) {
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

  const uid = user.uid;
  const ref = doc(db, "users", uid);
  const goalsRef = doc(db, "users", uid, "goals", "main");

  // If listeners already active for this uid, do NOT re-register (avoid duplicates).
  if (!activeListeners.has(uid)) {
    // create initial placeholder entry
    activeListeners.set(uid, {
      unsubRoot: null,
      unsubGoals: null,
      lastRootHash: null,
      lastGoalsHash: null,
    });

    // ---------------------------------------------------------------------
    // USER ROOT SNAPSHOT
    // ---------------------------------------------------------------------
    const unsubRoot = onSnapshot(
      ref,
      async (snap) => {
        try {
          if (!snap.exists()) {
            // create doc with sensible defaults (merge safe)
            try {
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
            } catch (err) {
              // Non-fatal: log and continue
              console.error("Failed to initialize user doc:", err);
            }
            return;
          }

          const data = snap.data() || {};

          // Use hashing to avoid calling setters when nothing changed
          const state = activeListeners.get(uid);
          const rootHash = hashObj({
            enrolledCourses: data.enrolledCourses,
            courseProgress: data.courseProgress,
            isPremium: data.isPremium,
            goals: data.goals,
          });

          if (state && state.lastRootHash === rootHash) {
            // nothing changed — skip
            return;
          }

          if (setEnrolledCourses && Array.isArray(data.enrolledCourses)) {
            setEnrolledCourses(data.enrolledCourses || []);
          }

          if (setCourseProgress && data.courseProgress) {
            setCourseProgress(data.courseProgress || {});
          }

          if (data.isPremium && setUser) {
            setUser((u) => (u ? { ...u, isPremium: true } : u));
          }

          // optional fallback if goals are stored at root
          if (data.goals && setUserGoals) {
            setUserGoals(data.goals);
          }

          if (state) {
            state.lastRootHash = rootHash;
            activeListeners.set(uid, state);
          }
        } catch (err) {
          console.error("Error in root onSnapshot handler:", err);
        }
      },
      (err) => {
        console.error("Root snapshot error:", err);
      }
    );

    // ---------------------------------------------------------------------
    // GOALS SNAPSHOT (MAIN SOURCE OF TRUTH)
    // ---------------------------------------------------------------------
    const unsubGoals = onSnapshot(
      goalsRef,
      (snap) => {
        try {
          const state = activeListeners.get(uid);
          const goalsData = snap.exists() ? snap.data() : null;
          const goalsHash = hashObj(goalsData);

          if (state && state.lastGoalsHash === goalsHash) {
            return;
          }

          if (setUserGoals) {
            if (goalsData) setUserGoals(goalsData);
            else setUserGoals(null);
          }

          if (state) {
            state.lastGoalsHash = goalsHash;
            activeListeners.set(uid, state);
          }
        } catch (err) {
          console.error("Error in goals onSnapshot handler:", err);
        }
      },
      (err) => {
        console.error("Goals snapshot error:", err);
      }
    );

    // store unsub functions
    activeListeners.set(uid, {
      unsubRoot,
      unsubGoals,
      lastRootHash: null,
      lastGoalsHash: null,
    });
  }

  // Safety: unsubscribe all listeners on page unload to avoid leaks in long-running sessions
  if (typeof window !== "undefined") {
    if (!window.__cybercode_userdata_unload_hook__) {
      window.__cybercode_userdata_unload_hook__ = true;
      window.addEventListener("beforeunload", () => {
        for (const [k, val] of activeListeners.entries()) {
          try {
            val?.unsubRoot && val.unsubRoot();
            val?.unsubGoals && val.unsubGoals();
          } catch {}
        }
        activeListeners.clear();
      });
    }
  }

  // =====================================================================
  // 1. ENROLL IN COURSE
  // =====================================================================
  const enrollInCourse = async (courseSlug) => {
    try {
      await updateDoc(ref, {
        enrolledCourses: arrayUnion(courseSlug),
      });
    } catch (err) {
      console.error("enrollInCourse failed:", err);
      throw err;
    }
  };

  // =====================================================================
  // 2. COMPLETE LESSON (TRANSACTION)
  // =====================================================================
  const completeLessonFS = async (courseSlug, lessonSlug) => {
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        const data = snap.exists() ? snap.data() : {};
        const course = data.courseProgress?.[courseSlug] || {};

        const completed = new Set(course.completedLessons || []);
        completed.add(lessonSlug);

        tx.update(ref, {
          [`courseProgress.${courseSlug}.completedLessons`]: [...completed],
          [`courseProgress.${courseSlug}.currentLessonIndex`]: completed.size,
          [`courseProgress.${courseSlug}.updatedAt`]: Date.now(),
        });
      });
    } catch (err) {
      console.error("completeLessonFS transaction failed:", err);
      throw err;
    }
  };

  // =====================================================================
  // 3. RECORD STUDY SESSION
  // =====================================================================
  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!minutes || minutes <= 0) return;
    const today = new Date().toISOString().split("T")[0];

    try {
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
    } catch (err) {
      console.error("recordStudySession failed:", err);
      // don't throw; non-critical
    }
  };

  // =====================================================================
  // 4. RESET ALL PROGRESS
  // =====================================================================
  const resetMyProgress = async () => {
    try {
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
    } catch (err) {
      console.error("resetMyProgress failed:", err);
      throw err;
    }
  };

  // =====================================================================
  // 5. PREMIUM ACCESS
  // =====================================================================
  const grantCertificationAccess = async () => {
    try {
      await updateDoc(ref, {
        hasCertificationAccess: true,
        isPremium: true,
      });
    } catch (err) {
      console.error("grantCertificationAccess failed:", err);
      throw err;
    }
  };

  const grantServerAccess = async () => {
    try {
      await updateDoc(ref, {
        hasServerAccess: true,
        isPremium: true,
      });
    } catch (err) {
      console.error("grantServerAccess failed:", err);
      throw err;
    }
  };

  const grantFullPremium = async () => {
    try {
      await updateDoc(ref, {
        isPremium: true,
        hasCertificationAccess: true,
        hasServerAccess: true,
      });
    } catch (err) {
      console.error("grantFullPremium failed:", err);
      throw err;
    }
  };

  // =====================================================================
  // 6. SAVE USER GOALS (MAIN LOGIC)
  // =====================================================================
  const saveUserGoals = async (goals) => {
    try {
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
    } catch (err) {
      console.error("saveUserGoals failed:", err);
      throw err;
    }
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
