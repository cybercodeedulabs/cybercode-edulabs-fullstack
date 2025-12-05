// src/pages/LessonDetail.jsx
import React, {
  useState,
  useEffect,
  useRef,
  Suspense
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonsData from "../data/lessonsData";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useUser } from "../contexts/UserContext";
import ReactComponentSimulator from "../components/simulations/global/ReactComponentSimulator";
import { quickLessonPersonaDelta } from "../utils/personaEngine";
import courseData from "../data/courseData";

export default function LessonDetail() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [codeInputs, setCodeInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [running, setRunning] = useState({});
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);
  const [toast, setToast] = useState(null);

  // prevent redirect race while completing a lesson
  const [suppressRedirect, setSuppressRedirect] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // NOTE: get everything from UserContext (useUser)
  const {
    user,
    enrolledCourses = [],
    courseProgress = {},
    updatePersonaScore,
    completeLessonLocal,
    setCourseProgress,
    recordStudySession, // ⏱ used for time tracking
  } = useUser();

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const lessons = lessonsData[courseSlug] || [];
  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : null;
  const course = courseData.find((c) => c.slug === courseSlug);

  // Reset code outputs when lesson changes
  useEffect(() => {
    setOutputs({});
    setCodeInputs({});
    setRunning({});
  }, [lessonSlug]);

  // determine progress number (defaults to 0)
  const progress =
    courseProgress &&
    courseProgress[courseSlug] &&
    typeof courseProgress[courseSlug].currentLessonIndex === "number"
      ? courseProgress[courseSlug].currentLessonIndex
      : 0;

  const isNextLesson = lessonIndex === progress;

  // Block locked lessons — guarded by suppressRedirect to avoid race during completion
  useEffect(() => {
    if (lessonIndex === -1) return;
    if (lessonIndex > progress && !suppressRedirect) {
      navigate(`/courses/${courseSlug}`, { replace: true });
    }
  }, [lessonIndex, progress, courseSlug, navigate, suppressRedirect]);

  // Persona updates when viewing lesson (gentle half-delta)
  useEffect(() => {
    if (!user || !lesson || typeof updatePersonaScore !== "function") return;
    try {
      const deltas = quickLessonPersonaDelta(lesson);
      if (Object.keys(deltas).length) {
        const halfDeltas = Object.fromEntries(
          Object.entries(deltas).map(([k, v]) => [
            k,
            Math.max(1, Math.round(v / 2)),
          ])
        );
        updatePersonaScore(halfDeltas);
      }
    } catch (err) {
      // swallow persona errors so UI stays responsive
      console.warn("Persona update skipped:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug, user, lesson]);

  // ⏱ STUDY-TIME TRACKING (per lesson)
  useEffect(() => {
    if (!user || typeof recordStudySession !== "function") return;
    const start = Date.now();

    return () => {
      const diffMs = Date.now() - start;
      const minutes = Math.round(diffMs / 60000); // round to nearest minute
      if (minutes > 0) {
        try {
          recordStudySession(courseSlug, lessonSlug, minutes);
        } catch (err) {
          console.warn("Failed to record study session:", err);
        }
      }
    };
  }, [user, courseSlug, lessonSlug, recordStudySession]);

  if (!lesson) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Lesson not found</h2>
        <p className="mt-4">
          The lesson you're looking for doesn't exist.{" "}
          <Link
            to={`/courses/${courseSlug}`}
            className="text-indigo-600 underline hover:text-indigo-500 transition"
          >
            Go back to course
          </Link>
        </p>
      </div>
    );
  }

  // ------------------------------------------------------
  // LOCAL-ONLY LESSON COMPLETION
  // ------------------------------------------------------
  const handleComplete = async () => {
    if (!user) {
      showToast("Please login to mark lesson complete.");
      return;
    }
    if (!enrolledCourses || !enrolledCourses.includes(courseSlug)) {
      showToast("Please enroll to complete lessons.");
      return;
    }
    if (!isNextLesson) {
      showToast("Complete previous lessons first!");
      return;
    }

    try {
      // prevent the blocking effect from immediately redirecting while update propagates
      setSuppressRedirect(true);

      if (typeof completeLessonLocal === "function") {
        // completeLessonLocal updates context state and per-user doc
        await completeLessonLocal(courseSlug, lessonSlug);
      } else {
        console.warn("completeLessonLocal not available on context.");
      }

      // award persona points for completing this lesson (full deltas)
      try {
        const deltas = quickLessonPersonaDelta(lesson);
        if (
          Object.keys(deltas).length &&
          typeof updatePersonaScore === "function"
        ) {
          updatePersonaScore(deltas);
        }
      } catch (err) {
        console.warn("Persona awarding skipped:", err);
      }

      showToast("Lesson completed successfully 🎉");

      // Move to next lesson automatically (if exists)
      const nextIndex = lessonIndex + 1;
      if (nextIndex < lessons.length) {
        setTimeout(() => {
          navigate(
            `/courses/${courseSlug}/lessons/${lessons[nextIndex].slug}`
          );
        }, 900);
      } else {
        // If last lesson, navigate back to course page after a brief pick
        setTimeout(() => navigate(`/courses/${courseSlug}`), 900);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to mark complete. Try again.");
    } finally {
      // brief cooldown so the blocking effect won't redirect while the next route loads
      setTimeout(() => setSuppressRedirect(false), 1200);
    }
  };

  // ------------------------------------------------------
  // CODE RUNNER LOGIC (UNCHANGED)
  // ------------------------------------------------------
  const handleRunCode = async (idx, language, defaultCode) => {
    const code = codeInputs[idx] ?? defaultCode ?? "";
    setRunning((s) => ({ ...s, [idx]: true }));
    setOutputs((prev) => ({ ...prev, [idx]: "" }));

    async function loadPyodideIfNeeded() {
      if (window.pyodide) return window.pyodide;
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
          s.onload = resolve;
          s.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(s);
        });
      }
      window.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      return window.pyodide;
    }

    try {
      // JS runner
      if (language === "javascript" || language === "js") {
        try {
          if (
            /require\(['"](express|fs|http|path|os|mongoose|dotenv)['"]\)/.test(
              code
            )
          ) {
            setOutputs((prev) => ({
              ...prev,
              [idx]:
                "⚠️ Node.js modules detected. Browser cannot run Express/FS/HTTP.\n" +
                "Run locally using Node.js.",
            }));
            setRunning((s) => ({ ...s, [idx]: false }));
            return;
          }
          const res = eval(code);
          setOutputs((prev) => ({
            ...prev,
            [idx]: String(res ?? "✓ Success"),
          }));
        } catch (err) {
          setOutputs((prev) => ({
            ...prev,
            [idx]: `❌ ${err.message}`,
          }));
        } finally {
          setRunning((s) => ({ ...s, [idx]: false }));
        }
        return;
      }

      // Python runner
      if (language === "python") {
        setOutputs((prev) => ({ ...prev, [idx]: "⏳ Loading Python..." }));
        try {
          const pyodide = await loadPyodideIfNeeded();
          setOutputs((prev) => ({ ...prev, [idx]: "⏳ Running..." }));

          if (
            /import\s+(requests|flask|boto3|sklearn|numpy|pandas)/.test(code)
          ) {
            setOutputs((prev) => ({
              ...prev,
              [idx]:
                "⚠️ External libraries not supported in browser.\nRun locally using Python.",
            }));
            setRunning((s) => ({ ...s, [idx]: false }));
            return;
          }

          const captured = [];
          pyodide.setStdout({ batched: (s) => captured.push(s) });
          pyodide.setStderr({ batched: (s) => captured.push(s) });

          const result = await pyodide.runPythonAsync(code);
          setOutputs((prev) => ({
            ...prev,
            [idx]: captured.join("") || String(result || "✓ Success"),
          }));
        } catch (err) {
          setOutputs((prev) => ({
            ...prev,
            [idx]: `❌ ${err.message}`,
          }));
        } finally {
          setRunning((s) => ({ ...s, [idx]: false }));
        }
        return;
      }

      // Go runner
      if (language === "go" || language === "golang") {
        setOutputs((prev) => ({ ...prev, [idx]: "⏳ Running Go..." }));
        try {
          const payload = new URLSearchParams();
          payload.append("version", "2");
          payload.append("body", code);

          const resp = await fetch("https://go.dev/_/play/compile", {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: payload.toString(),
          });

          const data = await resp.json();
          if (data.Errors) {
            setOutputs((prev) => ({
              ...prev,
              [idx]: `❌ ${data.Errors}`,
            }));
          } else {
            const output = (data.Events || [])
              .map((e) => e.Message)
              .join("");
            setOutputs((prev) => ({
              ...prev,
              [idx]: output || "✓ Success",
            }));
          }
        } catch {
          setOutputs((prev) => ({
            ...prev,
            [idx]:
              "⚠️ Go cannot run inline. Opening in Go Playground...",
          }));
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://go.dev/play/";
          form.target = "_blank";
          const textarea = document.createElement("textarea");
          textarea.name = "body";
          textarea.value = code;
          form.appendChild(textarea);
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } finally {
          setRunning((s) => ({ ...s, [idx]: false }));
        }
        return;
      }

      // Other languages
      if (["c", "cpp", "java"].includes(language)) {
        window.open("https://onecompiler.com", "_blank");
        setOutputs((prev) => ({
          ...prev,
          [idx]: `Opened ${language.toUpperCase()} editor.`,
        }));
        setRunning((s) => ({ ...s, [idx]: false }));
        return;
      }

      setOutputs((prev) => ({
        ...prev,
        [idx]: `⚠️ Unsupported language: ${language}`,
      }));
    } catch (err) {
      setOutputs((prev) => ({
        ...prev,
        [idx]: `❌ Unexpected error: ${err.message}`,
      }));
    } finally {
      setRunning((s) => ({ ...s, [idx]: false }));
    }
  };

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) setActiveSection(idx);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (idx) =>
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });

  const goPrev = () =>
    lessonIndex > 0 &&
    navigate(
      `/courses/${courseSlug}/lessons/${lessons[lessonIndex - 1].slug}`
    );

  const goNext = () =>
    lessonIndex < lessons.length - 1 &&
    navigate(
      `/courses/${courseSlug}/lessons/${lessons[lessonIndex + 1].slug}`
    );

  const handleCopy = (value, idx) => {
    navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // 🧭 Sidebar label helper: no more "Section 1 / 2"
  const getSectionLabel = (block, idx) => {
    if (block.navTitle) return block.navTitle;
    if (block.title) return block.title;

    switch (block.type) {
      case "text":
        return `Concept ${idx + 1}`;
      case "image":
        return `Diagram ${idx + 1}`;
      case "code":
        return `Code Example ${idx + 1}`;
      case "component":
        return `Interactive Lab ${idx + 1}`;
      default:
        return `Part ${idx + 1}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-sans lg:flex lg:gap-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="flex-1 space-y-12">
        {/* Header */}
        <div className="mb-12 bg-gradient-to-r from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-6 rounded-2xl shadow-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-200">
            {lesson.title}
          </h1>
          <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
            Lesson {lessonIndex + 1} of {lessons.length}
          </span>
        </div>

        {/* Lesson Content */}
        {lesson.content.map((block, idx) => (
          <div key={idx} ref={(el) => (sectionRefs.current[idx] = el)}>
            {/* TEXT */}
            {block.type === "text" && (
              <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {block.value}
                </ReactMarkdown>
              </div>
            )}

            {/* IMAGE */}
            {block.type === "image" && (
              <div className="flex justify-center my-6">
                <img
                  src={block.value}
                  alt={block.alt || "Lesson Image"}
                  className="rounded-xl shadow-lg max-w-full h-auto"
                />
              </div>
            )}

            {/* CODE BLOCK */}
            {block.type === "code" && (
              <div className="rounded-xl border dark:border-gray-700 shadow-md bg-white dark:bg-gray-900 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {block.language?.toUpperCase() || "CODE"} Snippet
                  </span>
                  {block.runnable && (
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                      Runnable Example
                    </span>
                  )}
                </div>

                <div className="relative">
                  <SyntaxHighlighter
                    language={block.language}
                    style={darkMode ? oneDark : oneLight}
                    className="!p-4 !text-sm"
                    showLineNumbers
                  >
                    {block.value}
                  </SyntaxHighlighter>

                  {/* JSX Simulator */}
                  {block.language === "jsx" && (
                    <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        ⚛️ JSX Code Detected — Launching React Simulator...
                      </p>
                      <Suspense fallback={<div>Loading JSX Simulator...</div>}>
                        <ReactComponentSimulator defaultCode={block.value} />
                      </Suspense>
                    </div>
                  )}

                  {/* COPY BUTTON */}
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                    onClick={() => handleCopy(block.value, idx)}
                  >
                    <Icon icon="mdi:content-copy" className="w-5 h-5" />
                  </button>

                  {copiedIdx === idx && (
                    <div className="absolute top-3 right-10 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Copied!
                    </div>
                  )}
                </div>

                {/* Runnable Code Area */}
                {block.runnable && (
                  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-4">
                    <textarea
                      value={codeInputs[idx] || block.value}
                      onChange={(e) =>
                        setCodeInputs((prev) => ({
                          ...prev,
                          [idx]: e.target.value,
                        }))
                      }
                      rows={6}
                      className="w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-black dark:text-white border rounded-md"
                    />

                    <button
                      onClick={() =>
                        handleRunCode(idx, block.language, block.value)
                      }
                      disabled={!!running[idx]}
                      className={`px-4 py-2 rounded-md font-medium ${
                        running[idx]
                          ? "bg-indigo-400 cursor-wait text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {running[idx]
                        ? "Running..."
                        : block.language === "go"
                        ? "Open in Go Playground"
                        : "Run Code"}
                    </button>

                    <pre className="p-3 bg-black rounded-md overflow-x-auto text-sm text-white font-mono">
                      {outputs[idx] || ""}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* COMPONENT SIMULATION */}
            {block.type === "component" && (
              <div className="my-10">
                <Suspense fallback={<div>Loading Component...</div>}>
                  {(() => {
                    // Safe dynamic component rendering: ensure hook order stability.
                    const Candidate = block.value;
                    if (!Candidate) return null;

                    // If value is a function/component, render as component.
                    if (typeof Candidate === "function") {
                      const Component = Candidate;
                      return <Component />;
                    }

                    // If value is already a React element, render it directly.
                    if (React.isValidElement(Candidate)) {
                      return Candidate;
                    }

                    // If it's something else (string / object), show a warning or nothing.
                    return null;
                  })()}
                </Suspense>
              </div>
            )}
          </div>
        ))}

        {/* COMPLETE LESSON BUTTON */}
        {user && enrolledCourses && enrolledCourses.includes(courseSlug) && (
          <button
            onClick={handleComplete}
            disabled={!isNextLesson}
            className={`px-6 py-3 rounded-lg font-semibold mt-6 ${
              isNextLesson
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {isNextLesson
              ? "Mark Lesson as Complete ✅"
              : "Lesson Locked 🔒"}
          </button>
        )}

        {/* ENROLL CTA (unchanged, but only when NOT enrolled) */}
        {!enrolledCourses?.includes(courseSlug) && (
          <div className="text-center mt-10 p-6 bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-2xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
              🚀 Want to go deeper?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Enroll in the full <strong>{course?.title}</strong> course for
              hands-on labs.
            </p>
            <button
              onClick={() => navigate(`/enroll/${courseSlug}`)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Enroll for Deep Dive & Certification
            </button>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={goPrev}
            disabled={lessonIndex === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl ${
              lessonIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            ← Previous Lesson
          </button>

          <Link
            to={`/courses/${courseSlug}`}
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 border border-indigo-600 rounded-xl"
          >
            ← Back to Course
          </Link>

          <button
            onClick={goNext}
            disabled={lessonIndex === lessons.length - 1}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl ${
              lessonIndex === lessons.length - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="hidden lg:block w-64 sticky top-28 h-max border-l border-gray-200 dark:border-gray-700 pl-6">
        <h4 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
          Lesson Contents
        </h4>

        <ul className="space-y-2 text-sm">
          {lesson.content.map((block, idx) => (
            <li
              key={idx}
              onClick={() => scrollToSection(idx)}
              className={`cursor-pointer p-2 rounded-md ${
                activeSection === idx
                  ? "bg-indigo-100 dark:bg-indigo-700 font-semibold"
                  : "hover:bg-indigo-50 dark:hover:bg-gray-700"
              }`}
            >
              {getSectionLabel(block, idx)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
