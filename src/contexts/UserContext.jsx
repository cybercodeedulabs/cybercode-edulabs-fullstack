// src/contexts/UserContext.jsx
// Backend-first UserContext (PostgreSQL + Render)
// Full server sync for user, personas, progress, projects, goals, sessions.

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const UserContext = createContext();

const API = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "cybercode_token";

// ---------- safe localStorage helpers (small wrappers) ----------
const safeGet = (k, fallback = null) => {
  try {
    const s = window?.localStorage?.getItem(k);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
};
const safeSet = (k, v) => {
  try {
    window?.localStorage?.setItem(k, JSON.stringify(v));
  } catch {}
};
const safeRemove = (k) => {
  try {
    window?.localStorage?.removeItem(k);
  } catch {}
};

// ---------- Provider ----------
export const UserProvider = ({ children }) => {
  // Core
  const [user, setUser] = useState(null); // { uid, name, email, photo, ... }
  const [token, setToken] = useState(() => safeGet(TOKEN_KEY, null));
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // App state derived from server
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [generatedProjects, setGeneratedProjects] = useState([]);
  const [personaScores, setPersonaScores] = useState({});
  const [userGoals, setUserGoalsState] = useState(null);
  const [userStats, setUserStats] = useState({});

  // ---------- helpers ----------
  const authHeaders = (extra = {}) => {
    const tk = token;
    const headers = {
      "Content-Type": "application/json",
      ...extra,
    };
    if (tk) headers.Authorization = `Bearer ${tk}`;
    return headers;
  };

  const applyToken = (tk) => {
    setToken(tk);
    if (tk) safeSet(TOKEN_KEY, tk);
    else safeRemove(TOKEN_KEY);
  };

  // ---------- AUTH: loginWithGoogle ----------
  const loginWithGoogle = useCallback(
    async ({ uid, name, email, photo }) => {
      if (!API) throw new Error("VITE_API_URL not set");

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, name, email, photo }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Backend login failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        if (!data?.token || !data?.user) throw new Error("Invalid login response");

        setUser(data.user);
        applyToken(data.token);

        // hydrate additional user data
        await loadUserProfile(data.user.uid);

        return data.user;
      } catch (err) {
        console.error("loginWithGoogle error:", err);
        throw err;
      }
    },
    [API]
  );

  // ---------- LOAD USER PROFILE ----------
  const loadUserProfile = useCallback(
    async (uid) => {
      if (!API || !uid || !token) return null;

      try {
        const res = await fetch(`${API}/user/${uid}`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          console.warn("loadUserProfile: server returned", res.status);
          return null;
        }

        const j = await res.json();
        if (j?.user) setUser(j.user);

        if (Array.isArray(j?.enrolledCourses)) {
          setEnrolledCourses(j.enrolledCourses);
        } else setEnrolledCourses([]);

        if (Array.isArray(j?.projects)) {
          const mapped = j.projects.map((p) => ({
            ...p,
            rawJson: p.raw_json ?? p.rawJson ?? null,
          }));
          setGeneratedProjects(mapped);
        } else setGeneratedProjects([]);

        // courseProgress doc
        try {
          const docResp = await fetch(`${API}/userdocs/doc/${uid}/courseProgress`, {
            headers: authHeaders(),
          });
          if (docResp.ok) {
            const docJson = await docResp.json().catch(() => null);
            if (docJson?.doc && typeof docJson.doc === "object") {
              setCourseProgress(docJson.doc);
            }
          }
        } catch {}

        // persona
        try {
          const pResp = await fetch(`${API}/userdocs/persona/${uid}`, {
            headers: authHeaders(),
          });
          if (pResp.ok) {
            const pj = await pResp.json().catch(() => null);
            if (pj?.scores) setPersonaScores(pj.scores);
          }
        } catch {}

        // user goals
        try {
          const gResp = await fetch(`${API}/goals/me`, {
            headers: authHeaders(),
          });
          if (gResp.ok) {
            const gj = await gResp.json().catch(() => null);
            if (gj?.goals) setUserGoalsState(gj.goals);
          }
        } catch {}

        return j;
      } catch (err) {
        console.error("loadUserProfile error:", err);
        return null;
      }
    },
    [API, token]
  );

  // ---------- ENROLL ----------
  const enrollInCourse = useCallback(
    async (courseSlug) => {
      if (!courseSlug) return false;

      // local optimistic
      const applyLocal = () =>
        setEnrolledCourses((prev) => {
          if (Array.isArray(prev) && prev.includes(courseSlug)) return prev;
          return [...(Array.isArray(prev) ? prev : []), courseSlug];
        });

      if (!token || !user?.uid) {
        applyLocal();
        return true;
      }

      try {
        const res = await fetch(`${API}/user/enroll`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ courseSlug }),
        });

        if (!res.ok) throw new Error("Enroll failed");

        applyLocal();

        // 🔥 NEW: Auto refresh backend data
        if (loadUserProfile && user?.uid) {
          await loadUserProfile(user.uid);
        }

        return true;
      } catch (err) {
        console.error("enrollInCourse error:", err);
        applyLocal();
        return false;
      }
    },
    [API, token, user, loadUserProfile]
  );

  // ---------- PROGRESS: completeLesson ----------
  const completeLesson = useCallback(
    async (courseSlug, lessonSlug) => {
      if (!token || !user?.uid) {
        return await completeLessonLocal(courseSlug, lessonSlug);
      }

      try {
        const res = await fetch(`${API}/progress/complete-lesson`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ courseSlug, lessonSlug }),
        });

        if (!res.ok) throw new Error("complete-lesson failed");

        await completeLessonLocal(courseSlug, lessonSlug);

        // optional: activity
        try {
          await fetch(`${API}/userdocs/activity`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({
              uid: user.uid,
              eventType: "complete_lesson",
              meta: { course: courseSlug, lesson: lessonSlug },
            }),
          });
        } catch {}

        return true;
      } catch (err) {
        console.error("completeLesson error:", err);
        return await completeLessonLocal(courseSlug, lessonSlug);
      }
    },
    [API, token, user]
  );

  // ---------- PROGRESS: completeLessonLocal ----------
  const completeLessonLocal = useCallback(
    async (courseSlug, lessonSlug) => {
      try {
        let updatedCourseProgress = null;

        setCourseProgress((prev) => {
          const base = prev || {};
          const course = base[courseSlug] || {
            completedLessons: [],
            currentLessonIndex: 0,
            sessions: [],
            timeSpentMinutes: 0,
          };

          const updated = Array.from(
            new Set([...(course.completedLessons || []), lessonSlug])
          );

          const nextCourse = {
            ...course,
            completedLessons: updated,
            currentLessonIndex: updated.length,
            sessions: Array.isArray(course.sessions) ? course.sessions : [],
            timeSpentMinutes: course.timeSpentMinutes || 0,
            updatedAt: new Date().toISOString(),
          };

          updatedCourseProgress = {
            ...base,
            [courseSlug]: nextCourse,
          };

          return updatedCourseProgress;
        });

        // 🔥 NEW: store local cache
        safeSet("cc_course_progress_cache", updatedCourseProgress);

        // persist to server doc
        if (token && user?.uid) {
          try {
            await fetch(`${API}/userdocs/doc`, {
              method: "POST",
              headers: authHeaders(),
              body: JSON.stringify({
                uid: user.uid,
                key: "courseProgress",
                doc: {
                  ...safeGet("cc_course_progress_cache", {}),
                  ...updatedCourseProgress,
                },
              }),
            });
          } catch {}
        }

        return updatedCourseProgress;
      } catch (err) {
        console.warn("completeLessonLocal failed", err);
        return null;
      }
    },
    [API, token, user]
  );

  // ---------- STUDY SESSIONS ----------
  const recordStudySession = useCallback(
    async (courseSlug, lessonSlug, minutes) => {
      if (!courseSlug || !lessonSlug || !Number.isFinite(Number(minutes)))
        return false;

      // local update stats
      setUserStats((prev) => {
        const base = prev || {};
        const total = (base.totalMinutes || 0) + Number(minutes);
        const daily = { ...(base.daily || {}) };
        const today = new Date().toISOString().split("T")[0];

        daily[today] = (daily[today] || 0) + Number(minutes);

        return {
          ...base,
          totalMinutes: total,
          daily,
          lastStudyDate: today,
        };
      });

      if (token && user?.uid) {
        try {
          const res = await fetch(`${API}/progress/study-session`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ courseSlug, lessonSlug, minutes }),
          });

          if (!res.ok) throw new Error("study-session failed");

          try {
            await fetch(`${API}/userdocs/activity`, {
              method: "POST",
              headers: authHeaders(),
              body: JSON.stringify({
                uid: user.uid,
                eventType: "study_session",
                meta: { course: courseSlug, lesson: lessonSlug, minutes },
              }),
            });
          } catch {}

          return true;
        } catch (err) {
          console.warn("recordStudySession server failed", err);
          return false;
        }
      }

      return false;
    },
    [API, token, user]
  );

  // ---------- PROJECTS ----------
  const saveGeneratedProject = useCallback(
    async ({ title, description, rawJson }) => {
      if (!token || !user?.uid) {
        const withId = {
          id: `local-${Date.now()}-${Math.random()}`,
          title,
          description,
          rawJson,
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        };
        setGeneratedProjects((prev) => [withId, ...(prev || [])]);
        return withId.id;
      }

      try {
        const res = await fetch(`${API}/projects/save`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ title, description, rawJson }),
        });

        if (!res.ok) throw new Error("Project save failed");

        const j = await res.json();

        const newProject = {
          id: j.id,
          title,
          description,
          rawJson,
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        };

        setGeneratedProjects((prev) => [newProject, ...(prev || [])]);
        return j.id;
      } catch (err) {
        console.error("saveGeneratedProject error:", err);
        return null;
      }
    },
    [API, token, user]
  );

  const loadGeneratedProjects = useCallback(async () => {
    if (!token) return generatedProjects;

    try {
      const res = await fetch(`${API}/projects/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error("Failed to load projects");

      const j = await res.json();
      if (j?.projects) {
        setGeneratedProjects(j.projects);
        return j.projects;
      }
      return [];
    } catch (err) {
      console.warn("loadGeneratedProjects error:", err);
      return generatedProjects;
    }
  }, [API, token, generatedProjects]);

  // ---------- PERSONA ----------
  const savePersonaScores = useCallback(
    async (scoresObj = {}) => {
      if (!user?.uid) {
        setPersonaScores((prev) => ({ ...(prev || {}), ...scoresObj }));
        return true;
      }

      try {
        const res = await fetch(`${API}/userdocs/persona`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ uid: user.uid, scores: scoresObj }),
        });

        if (!res.ok) throw new Error("persona save failed");

        setPersonaScores((prev) => ({ ...(prev || {}), ...scoresObj }));
        return true;
      } catch (err) {
        console.warn("savePersonaScores failed", err);
        setPersonaScores((prev) => ({ ...(prev || {}), ...scoresObj }));
        return false;
      }
    },
    [API, token, user]
  );

  const loadPersonaScores = useCallback(
    async (uid) => {
      if (!uid || !token) return personaScores;
      try {
        const res = await fetch(`${API}/userdocs/persona/${uid}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return personaScores;
        const j = await res.json();
        if (j?.scores) setPersonaScores(j.scores);
        return j.scores || {};
      } catch {
        return personaScores;
      }
    },
    [API, token, personaScores]
  );

  const updatePersonaScore = useCallback(
    (objOrKey, deltaOrVal = 0) => {
      let next = {};
      if (typeof objOrKey === "string") {
        next = { [objOrKey]: Number(deltaOrVal || 0) };
      } else if (objOrKey && typeof objOrKey === "object") {
        next = { ...objOrKey };
      } else return;

      setPersonaScores((prev) => {
        const merged = { ...(prev || {}) };
        for (const [k, v] of Object.entries(next)) {
          merged[k] = (merged[k] || 0) + Number(v || 0);
        }
        safeSet("cc_persona_cache", merged);
        return merged;
      });

      savePersonaScores(next).catch(() => {});
    },
    [savePersonaScores]
  );

  const getTopPersona = useCallback(() => {
    const entries = Object.entries(personaScores || {});
    if (entries.length === 0)
      return { persona: "beginner", score: 0, all: [["beginner", 0]] };
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return {
      persona: sorted[0][0],
      score: Number(sorted[0][1]),
      all: sorted,
    };
  }, [personaScores]);

  // ---------- USER DOCUMENTS ----------
  const saveUserDoc = useCallback(
    async (key, doc) => {
      if (!user?.uid) return false;
      try {
        const res = await fetch(`${API}/userdocs/doc`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ uid: user.uid, key, doc }),
        });
        if (!res.ok) throw new Error("userdoc save failed");
        return true;
      } catch (err) {
        console.warn("saveUserDoc failed", err);
        return false;
      }
    },
    [API, token, user]
  );

  const loadUserDoc = useCallback(
    async (key) => {
      if (!user?.uid) return null;
      try {
        const res = await fetch(`${API}/userdocs/doc/${user.uid}/${key}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return null;
        const j = await res.json();
        return j.doc || null;
      } catch {
        return null;
      }
    },
    [API, token, user]
  );

  // ---------- GOALS ----------
  const saveUserGoals = useCallback(
    async (hoursPerWeek) => {
      if (!token || !user?.uid) return false;
      try {
        const res = await fetch(`${API}/goals/save`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ hoursPerWeek }),
        });
        if (!res.ok) throw new Error("goals save failed");
        setUserGoalsState({
          hoursPerWeek,
          updatedAt: new Date().toISOString(),
        });
        return true;
      } catch (err) {
        console.warn("saveUserGoals failed", err);
        return false;
      }
    },
    [API, token, user]
  );

  const loadUserGoals = useCallback(async () => {
    if (!token || !user?.uid) return null;
    try {
      const res = await fetch(`${API}/goals/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error("goals fetch failed");
      const j = await res.json();
      if (j?.goals) {
        setUserGoalsState(j.goals);
        return j.goals;
      }
      return null;
    } catch (err) {
      console.warn("loadUserGoals failed", err);
      return null;
    }
  }, [API, token, user]);

  // ---------- LOGOUT ----------
  const logout = useCallback(() => {
    applyToken(null);
    setUser(null);
    setEnrolledCourses([]);
    setCourseProgress({});
    setGeneratedProjects([]);
    setPersonaScores({});
    setUserGoalsState(null);
    setUserStats({});
    try {
      window.location.href = "/";
    } catch {}
  }, []);

  // ---------- HYDRATION ----------
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const cachedUser = safeGet("cybercode_user_cache", null);
          if (cachedUser?.uid) {
            setUser(cachedUser);
            await loadUserProfile(cachedUser.uid);
          }
        } catch (err) {
          console.warn("Hydration failed:", err);
        }
      }
      setLoading(false);
      setHydrated(true);
    };

    init();
  }, []);

  useEffect(() => {
    try {
      if (user && user.uid) safeSet("cybercode_user_cache", user);
      else safeRemove("cybercode_user_cache");
    } catch {}
  }, [user]);

  // ---------- EXPOSED CONTEXT ----------
  return (
    <UserContext.Provider
      value={{
        user,
        token,
        hydrated,
        loading,

        setUser,
        loginWithGoogle,
        logout,

        enrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress,
        completeLesson,
        completeLessonLocal,

        recordStudySession,

        personaScores,
        updatePersonaScore,
        getTopPersona,
        loadPersonaScores,

        generatedProjects,
        saveGeneratedProject,
        loadGeneratedProjects,

        userGoals,
        saveUserGoals,
        loadUserGoals,
        saveUserDoc,
        loadUserDoc,

        userStats,
        setUserStats,
      }}
    >
      {hydrated ? (
        children
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center text-gray-400">
          Loading…
        </div>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
