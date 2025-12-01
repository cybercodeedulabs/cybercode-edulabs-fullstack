// src/hooks/useUserData.js
// Local-only implementation for prototyping while Firestore quota is exhausted.
// Stores a simple "user document" in localStorage under key `cc_userdoc_<uid>`
// and goals under `cc_goals_<uid>`.
// Exposes the same functions used by the app: enrollInCourse, completeLessonFS, recordStudySession, resetMyProgress, grantCertificationAccess, grantServerAccess, grantFullPremium, saveUserGoals.

export default function useUserData(
  user,
  { setEnrolledCourses, setCourseProgress, setUser, setUserGoals }
) {
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

  // If no user -> return no-op functions maintaining same interface
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

  // Ensure a minimal initial local doc exists
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

  // On first call, hydrate the UI with local data
  (function hydrateOnce() {
    const doc = ensureInitialLocalDoc();
    if (setEnrolledCourses) setEnrolledCourses(doc.enrolledCourses || []);
    if (setCourseProgress) setCourseProgress(doc.courseProgress || {});
    // goals may be stored separately
    const g = readGoalsDoc(uid);
    if (g && setUserGoals) setUserGoals(g);
    if (doc.isPremium && setUser) setUser((u) => (u ? { ...u, isPremium: true } : u));
  })();

  // ACTIONS (local-only)

  const persistAndNotify = (nextDoc) => {
    writeUserDoc(uid, nextDoc);
    if (setEnrolledCourses) setEnrolledCourses(nextDoc.enrolledCourses || []);
    if (setCourseProgress) setCourseProgress(nextDoc.courseProgress || {});
    if (setUser) setUser((u) => (u ? { ...u, isPremium: nextDoc.isPremium } : u));
  };

  const enrollInCourse = async (courseSlug) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const nextEnrolled = Array.isArray(doc.enrolledCourses) ? [...doc.enrolledCourses] : [];
    if (!nextEnrolled.includes(courseSlug)) nextEnrolled.push(courseSlug);
    const next = { ...doc, enrolledCourses: nextEnrolled, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const completeLessonFS = async (courseSlug, lessonSlug) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const cp = { ...(doc.courseProgress || {}) };
    const existing = cp[courseSlug] || { completedLessons: [], currentLessonIndex: 0 };
    const set = new Set(existing.completedLessons || []);
    set.add(lessonSlug);
    const completedLessons = Array.from(set);
    cp[courseSlug] = {
      ...existing,
      completedLessons,
      currentLessonIndex: completedLessons.length,
      updatedAt: nowTs(),
    };
    const next = { ...doc, courseProgress: cp, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const recordStudySession = async (courseSlug, lessonSlug, minutes) => {
    if (!minutes || minutes <= 0) return;
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const usrStats = { ...(doc.userStats || {}) };
    const today = new Date().toISOString().split("T")[0];
    usrStats.daily = { ...(usrStats.daily || {}) };
    usrStats.daily[today] = (usrStats.daily[today] || 0) + minutes;
    usrStats.totalMinutes = (usrStats.totalMinutes || 0) + minutes;

    // Streak calculation (simple)
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
    usrStats.longestStreak = Math.max(usrStats.longestStreak || 0, newStreak);

    // weeklyMinutes (last 7)
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }
    const weeklyMinutes = last7.reduce((sum, d) => sum + Number(usrStats.daily[d] || 0), 0);
    usrStats.weeklyMinutes = weeklyMinutes;

    // weeklyPct based on saved goals.hoursPerWeek if present
    const goals = readGoalsDoc(uid) || {};
    const hoursPerWeek = Number(goals.hoursPerWeek || 2);
    const weeklyGoal = hoursPerWeek * 60;
    usrStats.weeklyPct = weeklyGoal > 0 ? Math.round((weeklyMinutes / weeklyGoal) * 100) : 0;

    const streakFactor = Math.min(40, newStreak * 3);
    const weeklyFactor = Math.min(50, Math.round((weeklyMinutes / Math.max(1, weeklyGoal)) * 50));
    usrStats.readinessPct = Math.min(100, streakFactor + weeklyFactor);

    // Update course progress sessions & timeSpentMinutes
    const cp = { ...(doc.courseProgress || {}) };
    const course = cp[courseSlug] || { timeSpentMinutes: 0, sessions: [], completedLessons: [], currentLessonIndex: 0 };
    course.timeSpentMinutes = (course.timeSpentMinutes || 0) + minutes;
    course.sessions = Array.isArray(course.sessions) ? [...course.sessions] : [];
    course.sessions.push({ lesson: lessonSlug, minutes, ts: nowTs() });
    cp[courseSlug] = course;

    const next = { ...doc, userStats: usrStats, courseProgress: cp, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const resetMyProgress = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const next = {
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
    };
    persistAndNotify(next);
  };

  const grantCertificationAccess = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const next = { ...doc, hasCertificationAccess: true, isPremium: true, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const grantServerAccess = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const next = { ...doc, hasServerAccess: true, isPremium: true, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const grantFullPremium = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const next = { ...doc, isPremium: true, hasCertificationAccess: true, hasServerAccess: true, updatedAt: nowTs() };
    persistAndNotify(next);
  };

  const saveUserGoals = async (goals) => {
    const now = nowTs();
    const payload = { ...goals, updatedAt: now, createdAt: goals.createdAt || now };
    writeGoalsDoc(uid, payload);
    if (setUserGoals) setUserGoals(payload);
  };

  // Extra helpers for generated projects (local only)
  const loadGeneratedProjects = async () => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    return doc.generatedProjects || [];
  };

  const saveGeneratedProject = async (project) => {
    const doc = readUserDoc(uid) || ensureInitialLocalDoc();
    const gp = Array.isArray(doc.generatedProjects) ? [...doc.generatedProjects] : [];
    const withId = { ...project, id: project.id || `${nowTs()}-${Math.random()}`, timestamp: nowTs() };
    gp.push(withId);
    const next = { ...doc, generatedProjects: gp, updatedAt: nowTs() };
    persistAndNotify(next);
    return withId;
  };

  // Return the API expected by the rest of the app
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
