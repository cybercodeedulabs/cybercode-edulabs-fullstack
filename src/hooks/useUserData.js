// src/hooks/useUserData.js
// Local-only implementation for prototyping while Firestore quota is exhausted.
// Stores a simple "user document" in localStorage under key `cc_userdoc_<uid>`
// and goals under `cc_goals_<uid>`.
// Exposes the same functions used by the app.

const USE_FIREBASE = import.meta.env.VITE_USE_FIRESTORE === "true";

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
  // In Firebase mode, do nothing (Firestore will override)
  if (USE_FIREBASE) {
    return {
      enrollInCourse: async () => {},
      completeLessonFS: async () => {},
      recordStudySession: async () => {},
      resetMyProgress: async () => {},
      grantCertificationAccess: async () => {},
      grantServerAccess: async () => {},
      grantFullPremium: async () => {},
      saveUserGoals: async () => {},
      loadGeneratedProjects: async () => [],
      saveGeneratedProject: async (p) => p,
    };
  }

  // Local storage helpers
  const userKey = (uid) => `cc_userdoc_${uid}`;
  const goalsKey = (uid) => `cc_goals_${uid}`;

  const nowTs = () => Date.now();

  const readUserDoc = (uid) => {
    try {
      const raw = localStorage.getItem(userKey(uid));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeUserDoc = (uid, obj) => {
    try {
      localStorage.setItem(userKey(uid), JSON.stringify(obj));
    } catch (e) {
      console.error("writeUserDoc failed", e);
    }
  };

  const readGoalsDoc = (uid) => {
    try {
      const raw = localStorage.getItem(goalsKey(uid));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeGoalsDoc = (uid, obj) => {
    try {
      localStorage.setItem(goalsKey(uid), JSON.stringify(obj));
    } catch (e) {
      console.error("writeGoalsDoc failed", e);
    }
  };

  // If no user -> return no-op functions
  if (!user) {
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

  // Ensure initial local doc exists
  const ensureInitialLocalDoc = () => {
    const existing = readUserDoc(uid) || {};
    const base = {
      enrolledCourses: existing.enrolledCourses || [],
      projects: existing.projects || [],
      isPremium: existing.isPremium || false,
      hasCertificationAccess: existing.hasCertificationAccess || false,
      hasServerAccess: existing.hasServerAccess || false,
      courseProgress: existing.courseProgress || {},
      userStats: existing.userStats || {
        totalMinutes: 0,
        daily: {},
        streakDays: 0,
        longestStreak: 0,
        lastStudyDate: "",
        weeklyMinutes: 0,
        weeklyPct: 0,
        readinessPct: 0,
      },
      updatedAt: existing.updatedAt || nowTs(),
    };
    writeUserDoc(uid, base);
    return base;
  };

  // Hydrate UI
  (function hydrateOnce() {
    const doc = ensureInitialLocalDoc();
    setEnrolledCourses?.(doc.enrolledCourses || []);
    setCourseProgress?.(doc.courseProgress || {});
    const g = readGoalsDoc(uid);
    if (g && setUserGoals) setUserGoals(g);
    if (doc.isPremium && setUser)
      setUser((u) => (u ? { ...u, isPremium: true } : u));
  })();

  // Write helper
  const persistAndNotify = (nextDoc) => {
    writeUserDoc(uid, nextDoc);
    setEnrolledCourses?.(nextDoc.enrolledCourses || []);
    setCourseProgress?.(nextDoc.courseProgress || {});
    setUser?.((u) => (u ? { ...u, isPremium: nextDoc.isPremium } : u));
  };

  // All local-only methods (unchanged)
  const enrollInCourse = async (courseSlug) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const nextEnrolled = Array.isArray(doc.enrolledCourses)
      ? [...doc.enrolledCourses]
      : [];
    if (!nextEnrolled.includes(courseSlug)) nextEnrolled.push(courseSlug);
    persistAndNotify({
      ...doc,
      enrolledCourses: nextEnrolled,
      updatedAt: nowTs(),
    });
  };

  const completeLessonFS = async (courseSlug, lessonSlug) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const cp = { ...(doc.courseProgress || {}) };
    const existing =
      cp[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
    const set = new Set(existing.completedLessons || []);
    set.add(lessonSlug);
    const completedLessons = Array.from(set);
    cp[courseSlug] = {
      ...existing,
      completedLessons,
      currentLessonIndex: completedLessons.length,
      updatedAt: nowTs(),
    };
    persistAndNotify({
      ...doc,
      courseProgress: cp,
      updatedAt: nowTs(),
    });
  };

  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!minutes || minutes <= 0) return;
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const usrStats = { ...(doc.userStats || {}) };
    const today = new Date().toISOString().split("T")[0];
    usrStats.daily = { ...(usrStats.daily || {}) };
    usrStats.daily[today] = (usrStats.daily[today] || 0) + minutes;
    usrStats.totalMinutes = (usrStats.totalMinutes || 0) + minutes;

    // streak logic (unchanged)
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    })();
    const lastStudyDate = usrStats.lastStudyDate || "";
    let oldStreak = Number(usrStats.streakDays || 0);
    let newStreak = oldStreak;
    if (lastStudyDate === today) newStreak = oldStreak || 1;
    else if (lastStudyDate === yesterday) newStreak = (oldStreak || 0) + 1;
    else newStreak = 1;
    usrStats.lastStudyDate = today;
    usrStats.streakDays = newStreak;
    usrStats.longestStreak = Math.max(
      usrStats.longestStreak || 0,
      newStreak
    );

    // weekly logic
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }
    const weeklyMinutes = last7.reduce(
      (sum, d) => sum + Number(usrStats.daily[d] || 0),
      0
    );
    usrStats.weeklyMinutes = weeklyMinutes;

    const goals = readGoalsDoc(uid) || {};
    const hoursPerWeek = Number(goals.hoursPerWeek || 2);
    const weeklyGoal = hoursPerWeek * 60;
    usrStats.weeklyPct =
      weeklyGoal > 0
        ? Math.round((weeklyMinutes / weeklyGoal) * 100)
        : 0;

    const streakFactor = Math.min(40, newStreak * 3);
    const weeklyFactor = Math.min(
      50,
      Math.round((weeklyMinutes / Math.max(1, weeklyGoal)) * 50)
    );
    usrStats.readinessPct = Math.min(
      100,
      streakFactor + weeklyFactor
    );

    const cp = { ...(doc.courseProgress || {}) };
    const course =
      cp[courseSlug] || {
        timeSpentMinutes: 0,
        sessions: [],
        completedLessons: [],
        currentLessonIndex: 0,
      };
    course.timeSpentMinutes =
      (course.timeSpentMinutes || 0) + minutes;
    course.sessions = Array.isArray(course.sessions)
      ? [...course.sessions]
      : [];
    course.sessions.push({
      lesson: lessonSlug,
      minutes,
      ts: nowTs(),
    });
    cp[courseSlug] = course;

    persistAndNotify({
      ...doc,
      userStats: usrStats,
      courseProgress: cp,
      updatedAt: nowTs(),
    });
  };

  const resetMyProgress = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      courseProgress: {},
      userStats: {
        totalMinutes: 0,
        daily: {},
        streakDays: 0,
        longestStreak: 0,
        lastStudyDate: "",
        weeklyMinutes: 0,
        weeklyPct: 0,
        readinessPct: 0,
      },
      updatedAt: nowTs(),
    });
  };

  const grantCertificationAccess = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      hasCertificationAccess: true,
      isPremium: true,
      updatedAt: nowTs(),
    });
  };

  const grantServerAccess = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      hasServerAccess: true,
      isPremium: true,
      updatedAt: nowTs(),
    });
  };

  const grantFullPremium = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    persistAndNotify({
      ...doc,
      isPremium: true,
      hasCertificationAccess: true,
      hasServerAccess: true,
      updatedAt: nowTs(),
    });
  };

  const saveUserGoals = async (goals) => {
    const now = nowTs();
    const payload = {
      ...goals,
      updatedAt: now,
      createdAt: goals.createdAt || now,
    };
    writeGoalsDoc(uid, payload);
    setUserGoals?.(payload);
  };

  // generated projects
  const loadGeneratedProjects = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    return doc.generatedProjects || [];
  };

  const saveGeneratedProject = async (project) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const gp = Array.isArray(doc.generatedProjects)
      ? [...doc.generatedProjects]
      : [];
    const withId = {
      ...project,
      id: project.id || `${nowTs()}-${Math.random()}`,
      timestamp: nowTs(),
    };
    gp.push(withId);
    persistAndNotify({
      ...doc,
      generatedProjects: gp,
      updatedAt: nowTs(),
    });
    return withId;
  };

  return {
    enrollInCourse,
    completeLessonFS,
    recordStudySession,
    resetMyProgress,
    grantCertificationAccess,
    grantServerAccess,
    grantFullPremium,
    saveUserGoals,
    loadGeneratedProjects,
    saveGeneratedProject,
  };
}
