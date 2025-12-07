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

// ---------- small helpers ----------
const isObject = (x) => x && typeof x === "object" && !Array.isArray(x);

/**
 * Normalize goals object coming from backend or client.
 * Always returns an object with safe fields and skills as an object.
 */
const normalizeGoals = (raw) => {
  const defaults = {
    currentStatus: "",
    motivation: "",
    targetRole: "",
    salaryExpectation: "",
    hoursPerWeek: 0,
    deadlineMonths: 0,
    learningStyle: "",
    skills: {
      programming: 0,
      cloud: 0,
      networking: 0,
      cybersecurity: 0,
      softSkills: 0,
    },
    updatedAt: new Date().toISOString(),
    createdAt: null,
  };

  if (!raw || typeof raw !== "object") return defaults;

  const out = { ...defaults, ...raw };

  // normalize numeric fields
  out.hoursPerWeek = Number(out.hoursPerWeek || 0);
  out.deadlineMonths = Number(out.deadlineMonths || 0);

  // normalize skills: may arrive as JSON string, or missing
  let skills = out.skills || {};
  if (typeof skills === "string") {
    try {
      skills = JSON.parse(skills);
    } catch {
      skills = {};
    }
  }
  if (!isObject(skills)) skills = {};

  // ensure keys exist and are numbers
  const baseSkills = {
    programming: 0,
    cloud: 0,
    networking: 0,
    cybersecurity: 0,
    softSkills: 0,
  };
  for (const k of Object.keys(baseSkills)) {
    baseSkills[k] = Number(skills[k] || baseSkills[k]);
  }
  out.skills = baseSkills;

  // ensure createdAt/updatedAt exist
  out.updatedAt = out.updatedAt || new Date().toISOString();
  out.createdAt = out.createdAt || null;

  return out;
};

/**
 * Lightweight JWT payload decode (no verification).
 * Extracts payload from a JWT (base64url decode) and returns parsed object or null.
 * Used only to obtain uid for client-side hydration when token exists.
 */
const decodeJwt = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // atob expects padded base64 length; add padding if necessary
    const padded = base64 + "==".slice((base64.length + 3) % 4);
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    // silent fail
    return null;
  }
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
  const [courseProgress, setCourseProgress] = useState({}); // { courseSlug: { completedLessons:[], currentLessonIndex, ... } }
  const [generatedProjects, setGeneratedProjects] = useState([]);
  const [personaScores, setPersonaScores] = useState({});
  const [userGoals, setUserGoalsState] = useState(null);
  const [userStats, setUserStats] = useState({});

  // ---------- helpers ----------
  const authHeaders = useCallback(
    (extra = {}) => {
      const tk = token;
      const headers = {
        "Content-Type": "application/json",
        ...extra,
      };
      if (tk) headers.Authorization = `Bearer ${tk}`;
      return headers;
    },
    [token]
  );

  const applyToken = (tk) => {
    setToken(tk);
    if (tk) safeSet(TOKEN_KEY, tk);
    else safeRemove(TOKEN_KEY);
  };

  // ---------- LOAD USER PROFILE (user row + enrolled courses + projects) ----------
  // NOTE: loadUserProfile is declared before loginWithGoogle to avoid
  // "access before initialization" ReferenceErrors when loginWithGoogle calls it.
  const loadUserProfile = useCallback(
    async (uid) => {
      if (!API || !uid || !token) return null;

      try {
        const res = await fetch(`${API}/user/${encodeURIComponent(uid)}`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          console.warn("loadUserProfile: server returned not ok", res.status);
          return null;
        }

        const j = await res.json();
        if (j?.user) {
          setUser(j.user);
        }

        if (Array.isArray(j?.enrolledCourses)) {
          setEnrolledCourses(j.enrolledCourses);
        } else {
          setEnrolledCourses([]);
        }

        if (Array.isArray(j?.projects)) {
          // normalize raw_json -> rawJson
          const mapped = j.projects.map((p) => ({
            ...p,
            rawJson: p.raw_json ?? p.rawJson ?? null,
          }));
          setGeneratedProjects(mapped);
        } else {
          setGeneratedProjects([]);
        }

        // Try to hydrate courseProgress & userStats from user_documents (if API supports)
        try {
          const docResp = await fetch(`${API}/userdocs/doc/${encodeURIComponent(uid)}/courseProgress`, {
            headers: authHeaders(),
          });
          if (docResp.ok) {
            const docJson = await docResp.json().catch(() => null);
            if (docJson?.doc && typeof docJson.doc === "object") {
              setCourseProgress(docJson.doc);
            }
          } else {
            // not found / 404 is fine — keep local empty state
          }
        } catch (err) {
          // ignore doc fetch failure
        }

        // persona
        try {
          const pResp = await fetch(`${API}/userdocs/persona/${encodeURIComponent(uid)}`, {
            headers: authHeaders(),
          });
          if (pResp.ok) {
            const pj = await pResp.json().catch(() => null);
            if (pj?.scores && typeof pj.scores === "object") {
              setPersonaScores(pj.scores);
            }
          }
        } catch (err) {
          // ignore persona fetch failure
        }

        // user goals
        try {
          const gResp = await fetch(`${API}/goals/me`, {
            headers: authHeaders(),
          });
          if (gResp.ok) {
            const gj = await gResp.json().catch(() => null);
            if (gj?.goals) {
              // normalize shape before setting
              const normalized = normalizeGoals(gj.goals);
              setUserGoalsState(normalized);
            }
          }
        } catch (err) {
          // ignore goals fetch failure
        }

        return j;
      } catch (err) {
        console.error("loadUserProfile error:", err);
        return null;
      }
    },
    [API, token, authHeaders]
  );

  // ---------- AUTH: loginWithGoogle (backend upsert) ----------
  // payload: { uid, name, email, photo }
  const loginWithGoogle = useCallback(
    async ({ uid, name, email, photo }) => {
      if (!API) throw new Error("VITE_API_URL not set");

      // sanitize UID to avoid accidental path characters (slashes, spaces)
      const sanitizeUid = (raw) => {
        if (!raw) return raw;
        try {
          return String(raw).replace(/[^a-zA-Z0-9-_]/g, "");
        } catch {
          return raw;
        }
      };

      const safeUid = sanitizeUid(uid);

      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: safeUid, name, email, photo }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Backend login failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        if (!data?.token || !data?.user) throw new Error("Invalid login response");

        // ensure user.uid is sanitized in client state as well
        const u = { ...data.user, uid: sanitizeUid(data.user.uid || safeUid) };

        setUser(u);
        applyToken(data.token);

        // hydrate other user data (call the function that is already initialized)
        try {
          await loadUserProfile(u.uid);
        } catch (err) {
          // ignore profile load errors here — login already succeeded
        }

        return u;
      } catch (err) {
        console.error("loginWithGoogle error:", err);
        throw err;
      }
    },
    [API, loadUserProfile]
  );

  // ---------- ENROLL ----------
  const enrollInCourse = useCallback(
    async (courseSlug) => {
      // optimistic local update even if server call fails
      if (!courseSlug) return false;
      if (!token || !user?.uid) {
        // cannot call server; do local optimistic
        setEnrolledCourses((prev) => {
          if (Array.isArray(prev) && prev.includes(courseSlug)) return prev;
          return [...(Array.isArray(prev) ? prev : []), courseSlug];
        });
        return true;
      }

      try {
        const res = await fetch(`${API}/user/enroll`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ courseSlug }),
        });

        if (!res.ok) {
          throw new Error("Enroll failed");
        }

        // reflect on UI
        setEnrolledCourses((prev) => {
          if (Array.isArray(prev) && prev.includes(courseSlug)) return prev;
          return [...(Array.isArray(prev) ? prev : []), courseSlug];
        });

        // try refresh profile
        if (typeof loadUserProfile === "function" && user?.uid) {
          await loadUserProfile(user.uid).catch(() => {});
        }

        return true;
      } catch (err) {
        console.error("enrollInCourse error:", err);
        // fallback to local update
        setEnrolledCourses((prev) =>
          Array.isArray(prev) && prev.includes(courseSlug)
            ? prev
            : [...(Array.isArray(prev) ? prev : []), courseSlug]
        );
        return false;
      }
    },
    [API, token, user, loadUserProfile, authHeaders]
  );

  // ---------- PROGRESS: completeLesson (server) ----------
  const completeLesson = useCallback(
    async (courseSlug, lessonSlug) => {
      if (!token || !user?.uid) {
        // fallback to local
        return await completeLessonLocal(courseSlug, lessonSlug);
      }

      try {
        const res = await fetch(`${API}/progress/complete-lesson`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ courseSlug, lessonSlug }),
        });

        if (!res.ok) {
          throw new Error("complete-lesson failed");
        }

        // update local state optimistically
        await completeLessonLocal(courseSlug, lessonSlug);

        // optionally: record activity
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
        // fallback
        return await completeLessonLocal(courseSlug, lessonSlug);
      }
    },
    // Note: completeLessonLocal is defined later but referenced by name; to keep ESLint happy,
    // declare dependency on token and user only (completeLessonLocal is stable because defined in same render).
    [API, token, user, authHeaders]
  );

  // ---------- PROGRESS: completeLessonLocal (state-only update; returns updated courseProgress) ----------
  // Keeps same behavior as your local implementation for compatibility.
  const completeLessonLocal = useCallback(
    async (courseSlug, lessonSlug) => {
      try {
        let updatedCourseProgress = null;

        setCourseProgress((prev) => {
          const base = prev && typeof prev === "object" ? prev : {};
          const course = base[courseSlug] || {
            completedLessons: [],
            currentLessonIndex: 0,
            sessions: [],
            timeSpentMinutes: 0,
          };

          const updated = Array.from(
            new Set([
              ...(Array.isArray(course.completedLessons)
                ? course.completedLessons
                : []),
              lessonSlug,
            ])
          );

          const nextCourse = {
            ...course,
            completedLessons: updated,
            currentLessonIndex: updated.length,
            sessions: Array.isArray(course.sessions) ? course.sessions : [],
            timeSpentMinutes:
              typeof course.timeSpentMinutes === "number"
                ? course.timeSpentMinutes
                : 0,
            updatedAt: new Date().toISOString(),
          };

          updatedCourseProgress = {
            ...base,
            [courseSlug]: nextCourse,
          };

          return updatedCourseProgress;
        });

        // persist to server user_documents if available
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
          } catch {
            // ignore
          }
        }

        // store local cache
        try {
          safeSet("cc_course_progress_cache", updatedCourseProgress);
        } catch {}

        return updatedCourseProgress;
      } catch (err) {
        console.warn("completeLessonLocal failed", err);
        return null;
      }
    },
    [API, token, user, authHeaders]
  );

  // ---------- STUDY SESSIONS ----------
  const recordStudySession = useCallback(
    async (courseSlug, lessonSlug, minutes) => {
      if (!courseSlug || !lessonSlug || !Number.isFinite(Number(minutes)))
        return false;

      // update local stats
      setUserStats((prev) => {
        const base = prev && typeof prev === "object" ? prev : {};
        const total = (base.totalMinutes || 0) + Number(minutes);
        const daily = { ...(base.daily || {}) };
        const today = new Date().toISOString().split("T")[0];
        daily[today] = (daily[today] || 0) + Number(minutes);

        const next = {
          ...base,
          totalMinutes: total,
          daily,
          lastStudyDate: today,
        };

        return next;
      });

      // send to server if possible
      if (token && user?.uid) {
        try {
          const res = await fetch(`${API}/progress/study-session`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ courseSlug, lessonSlug, minutes: Number(minutes) }),
          });

          if (!res.ok) {
            throw new Error("study-session failed");
          }

          // optionally log activity
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
          console.warn("recordStudySession server failed, local only", err);
          return false;
        }
      }

      return false;
    },
    [API, token, user, authHeaders]
  );

  // ---------- PROJECTS ----------
  const saveGeneratedProject = useCallback(
    async ({ title, description, rawJson }) => {
      if (!token || !user?.uid) {
        // local fallback: create id and store in in-memory state
        const withId = {
          id: `local-${Date.now()}-${Math.random()}`,
          title,
          description,
          rawJson,
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        };
        setGeneratedProjects((prev) => [withId, ...(Array.isArray(prev) ? prev : [])]);
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
        // add to UI list
        const newProject = {
          id: j.id,
          title,
          description,
          rawJson,
          timestamp: Date.now(),
          created_at: new Date().toISOString(),
        };
        setGeneratedProjects((prev) => [newProject, ...(Array.isArray(prev) ? prev : [])]);
        return j.id;
      } catch (err) {
        console.error("saveGeneratedProject error:", err);
        return null;
      }
    },
    [API, token, user, authHeaders]
  );

  const loadGeneratedProjects = useCallback(async () => {
    if (!token) {
      return generatedProjects;
    }

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
  }, [API, token, generatedProjects, authHeaders]);

  // ---------- PERSONA SCORES ----------
  const savePersonaScores = useCallback(
    async (scoresObj = {}) => {
      if (!user?.uid) {
        // update local in-memory only
        setPersonaScores((prev) => ({ ...(prev || {}), ...(scoresObj || {}) }));
        return true;
      }

      try {
        const res = await fetch(`${API}/userdocs/persona`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ uid: user.uid, scores: scoresObj }),
        });
        if (!res.ok) throw new Error("persona save failed");
        setPersonaScores((prev) => ({ ...(prev || {}), ...(scoresObj || {}) }));
        return true;
      } catch (err) {
        console.warn("savePersonaScores failed:", err);
        // fallback to local in-memory update
        setPersonaScores((prev) => ({ ...(prev || {}), ...(scoresObj || {}) }));
        return false;
      }
    },
    [API, token, user, authHeaders]
  );

  const loadPersonaScores = useCallback(
    async (uid) => {
      if (!uid || !token) return personaScores;
      try {
        const res = await fetch(`${API}/userdocs/persona/${encodeURIComponent(uid)}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return personaScores;
        const j = await res.json();
        if (j?.scores && typeof j.scores === "object") setPersonaScores(j.scores);
        return j.scores || {};
      } catch (err) {
        console.warn("loadPersonaScores failed", err);
        return personaScores;
      }
    },
    [API, token, personaScores, authHeaders]
  );

  const updatePersonaScore = useCallback(
    (objOrKey, deltaOrVal = 0) => {
      // supports either updatePersonaScore("cloud", 3) or updatePersonaScore({cloud:3,devops:2})
      let next = {};
      if (typeof objOrKey === "string") {
        next = { [objOrKey]: Number(deltaOrVal || 0) };
      } else if (objOrKey && typeof objOrKey === "object") {
        next = { ...objOrKey };
      } else {
        return;
      }

      // merge locally
      setPersonaScores((prev) => {
        const merged = { ...(prev || {}) };
        for (const [k, v] of Object.entries(next)) {
          merged[k] = (merged[k] || 0) + Number(v || 0);
        }
        // persist small cache in localStorage for speed
        try {
          safeSet("cc_persona_cache", merged);
        } catch {}
        return merged;
      });

      // persist to server (async)
      savePersonaScores(next).catch(() => {});
    },
    [savePersonaScores]
  );

  const getTopPersona = useCallback(() => {
    const entries = Object.entries(personaScores || {});
    if (entries.length === 0) return { persona: "beginner", score: 0, all: [["beginner", 0]] };
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return { persona: sorted[0][0], score: Number(sorted[0][1]), all: sorted };
  }, [personaScores]);

  // ---------- USER DOCUMENTS (generic) ----------
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
    [API, token, user, authHeaders]
  );

  const loadUserDoc = useCallback(
    async (key) => {
      if (!user?.uid) return null;
      try {
        const res = await fetch(`${API}/userdocs/doc/${encodeURIComponent(user.uid)}/${encodeURIComponent(key)}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return null;
        const j = await res.json();
        return j.doc || null;
      } catch (err) {
        console.warn("loadUserDoc failed", err);
        return null;
      }
    },
    [API, token, user, authHeaders]
  );

  // ---------- GOALS ----------
  /**
   * saveUserGoals supports:
   *  - saveUserGoals(hoursNumber)   // legacy behavior
   *  - saveUserGoals({ ...fullGoals }) // new behavior used by GoalSetupWizard
   *
   * It will attempt to POST full object first. If server rejects, it will fall back to sending { hoursPerWeek }.
   */
  const loadUserGoals = useCallback(async () => {
    if (!token || !user?.uid) return null;
    try {
      const res = await fetch(`${API}/goals/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error("goals fetch failed");
      const j = await res.json();
      if (j?.goals) {
        const normalized = normalizeGoals(j.goals);
        setUserGoalsState(normalized);
        return normalized;
      }
      return null;
    } catch (err) {
      console.warn("loadUserGoals failed", err);
      return null;
    }
  }, [API, token, user, authHeaders]);

  const saveUserGoals = useCallback(
    async (payload) => {
      // normalize to object
      let goalsObj;
      if (typeof payload === "number") {
        goalsObj = { hoursPerWeek: Number(payload) || 0 };
      } else if (payload && typeof payload === "object") {
        goalsObj = { ...payload };
      } else {
        return false;
      }

      // Add updatedAt locally
      const toStore = { ...goalsObj, updatedAt: new Date().toISOString() };

      // If no token or uid, store locally into context only
      if (!token || !user?.uid) {
        setUserGoalsState(normalizeGoals(toStore));
        return true;
      }

      // Try to POST full goals object to backend (preferred)
      try {
        const res = await fetch(`${API}/goals/save`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(toStore),
        });

        if (!res.ok) {
          // If server rejects full object, try legacy format fallback
          const text = await res.text().catch(() => "");
          console.warn("goals save server responded not ok, attempting fallback:", res.status, text);
          // attempt fallback if hoursPerWeek available
          if (typeof goalsObj.hoursPerWeek === "number") {
            try {
              const fallbackRes = await fetch(`${API}/goals/save`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ hoursPerWeek: goalsObj.hoursPerWeek }),
              });
              if (fallbackRes.ok) {
                setUserGoalsState(normalizeGoals(toStore));
                return true;
              }
            } catch (er) {
              // ignore fallback error
            }
          }
          throw new Error("goals save failed (server)");
        }

        // success
        setUserGoalsState(normalizeGoals(toStore));

        // optionally refresh from server-side record
        try {
          await loadUserGoals();
        } catch {}

        return true;
      } catch (err) {
        console.warn("saveUserGoals failed, saving locally:", err);
        // fallback to local state
        setUserGoalsState(normalizeGoals(toStore));
        return false;
      }
    },
    [API, token, user, loadUserGoals, authHeaders]
  );

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
    // redirect to home
    try {
      window.location.href = "/";
    } catch {}
  }, []);

  // ---------- Hydration ----------
  useEffect(() => {
    const init = async () => {
      // if token present, try load user profile
      if (token) {
        try {
          // attempt to reuse cached user if exist in localStorage to avoid extra request (compat)
          const cachedUser = safeGet("cybercode_user_cache", null);
          if (cachedUser?.uid) {
            setUser(cachedUser);
            await loadUserProfile(cachedUser.uid);
          } else {
            // if no cached user, attempt to extract uid from JWT and load profile
            const payload = decodeJwt(token);
            const uidFromToken = payload?.uid || payload?.sub || null;
            if (uidFromToken) {
              try {
                await loadUserProfile(uidFromToken);
              } catch (err) {
                // ignore individual profile load error
              }
            } else {
              // no uid available from token: wait for explicit loginWithGoogle or implement /auth/me on backend
            }
          }
        } catch (err) {
          console.warn("hydration loadUserProfile failed", err);
        }
      }
      setLoading(false);
      setHydrated(true);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // ensure this runs when token changes during runtime

  // Save minimal user cache whenever user updates (speed up hydration next time)
  useEffect(() => {
    try {
      if (user && user.uid) {
        safeSet("cybercode_user_cache", user);
      } else {
        safeRemove("cybercode_user_cache");
      }
    } catch {}
  }, [user]);

  // ---------- Exposed context ----------
  return (
    <UserContext.Provider
      value={{
        // state
        user,
        token,
        hydrated,
        loading,

        // user setters
        setUser,
        loginWithGoogle,
        logout,

        // courses & progress
        enrolledCourses,
        enrollInCourse,

        courseProgress,
        setCourseProgress,
        completeLesson,
        completeLessonLocal,

        // study sessions
        recordStudySession,

        // persona
        personaScores,
        updatePersonaScore,
        getTopPersona,
        loadPersonaScores,

        // projects
        generatedProjects,
        saveGeneratedProject,
        loadGeneratedProjects,

        // goals & docs
        userGoals,
        saveUserGoals,
        loadUserGoals,
        saveUserDoc,
        loadUserDoc,

        // misc
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
