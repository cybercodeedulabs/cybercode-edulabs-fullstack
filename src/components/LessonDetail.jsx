// src/pages/LessonDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonsData from "../data/lessonsData";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef, Suspense } from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useUser } from "../contexts/UserContext";
import ReactComponentSimulator from "../components/simulations/global/ReactComponentSimulator";
import { quickLessonPersonaDelta } from "../utils/personaEngine";



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

const showToast = (msg) => {
  setToast(msg);
  setTimeout(() => setToast(null), 2500);
};


  const { user, enrolledCourses, courseProgress, completeLesson, updatePersonaScore } = useUser();

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const lessons = lessonsData[courseSlug] || [];
  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessons[lessonIndex];
  // 🧹 Reset outputs when switching to a new lesson
useEffect(() => {
  setOutputs({});
  setCodeInputs({});
  setRunning({});
}, [lessonSlug]);
  const progress = courseProgress[courseSlug]?.currentLessonIndex || 0;
  const isNextLesson = lessonIndex === progress;
  // 🚫 Block navigation to locked lessons
useEffect(() => {
  if (lessonIndex > progress) {
    navigate(`/courses/${courseSlug}`, { replace: true });
  }
}, [lessonIndex, progress, courseSlug, navigate]);

{toast && (
  <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
    {toast}
  </div>
)}


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

  useEffect(() => {
  if (!user || !lesson) return;
  const deltas = quickLessonPersonaDelta(lesson);
  if (Object.keys(deltas).length) {
    // small view score (half of lesson completion score)
    const halfDeltas = Object.fromEntries(
      Object.entries(deltas).map(([k, v]) => [k, Math.max(1, Math.round(v / 2))])
    );
    updatePersonaScore(halfDeltas);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [lessonSlug, user]);


  // 🔹 Code Runner Logic (same as before)
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
  if (language === "javascript" || language === "js") {
    try {
      // 🧩 Detect Node.js-only modules (like Express, FS, HTTP, etc.)
      if (
        /require\(['"](express|fs|http|path|os|mongoose|dotenv)['"]\)/.test(code)
      ) {
        setOutputs((prev) => ({
          ...prev,
          [idx]:
            "⚠️ This code uses Node.js modules (like Express, FS, or HTTP). " +
            "It must run in a server environment, not inside the browser.\n\n" +
            "👉 To try it locally:\n" +
            "1️⃣ Save the file as `server.js`\n" +
            "2️⃣ Run `npm install express` (if applicable)\n" +
            "3️⃣ Start with `node server.js`\n\n" +
            "💡 Browser sandbox cannot execute Node.js code.",
        }));
        setRunning((s) => ({ ...s, [idx]: false }));
        return;
      }

      // ✅ Safe to execute client-side JS
      // eslint-disable-next-line no-eval
      const res = eval(code);
      setOutputs((prev) => ({
        ...prev,
        [idx]: String(res ?? "✅ Code executed successfully."),
      }));
    } catch (err) {
      setOutputs((prev) => ({ ...prev, [idx]: `❌ ${err.message}` }));
    } finally {
      setRunning((s) => ({ ...s, [idx]: false }));
    }
    return;
  }


      if (language === "python") {
  setOutputs((prev) => ({ ...prev, [idx]: "⏳ Loading Python runtime..." }));
  try {
    const pyodide = await loadPyodideIfNeeded();
    setOutputs((prev) => ({ ...prev, [idx]: "⏳ Running Python..." }));
    // 🧠 Auto-load supported Pyodide packages if detected in import
    const pyPackages = {
      yaml: "pyyaml",
      numpy: "numpy",
      pandas: "pandas",
      matplotlib: "matplotlib",
      scipy: "scipy",
    };

    for (const [mod, pkg] of Object.entries(pyPackages)) {
      if (new RegExp(`import\\s+${mod}`).test(code)) {
        setOutputs((prev) => ({
          ...prev,
          [idx]: `📦 Installing required package: ${pkg}...`,
        }));
        await pyodide.loadPackage(pkg);
      }
    }

    // 🧠 Detect unsupported external packages (like requests, pandas, flask, etc.)
    if (/import\s+(requests|flask|pandas|numpy|matplotlib|boto3|sklearn|sqlite3|subprocess|unittest)/.test(code)) {
      setOutputs((prev) => ({
        ...prev,
        [idx]:
          "⚠️ This code imports external Python libraries (e.g., requests, pandas, flask).\n" +
          "Pyodide — the in-browser Python runtime — supports only standard libraries.\n\n" +
          "👉 To try this locally:\n" +
          "1️⃣ Save this code as `script.py`\n" +
          "2️⃣ Run `pip install <library>` (e.g., `pip install requests`)\n" +
          "3️⃣ Execute using `python script.py`\n\n" +
          "💡 Browser sandbox cannot install or use external pip modules.",
      }));
      setRunning((s) => ({ ...s, [idx]: false }));
      return;
    }

    const captured = [];
    pyodide.setStdout({ batched: (s) => captured.push(s) });
    pyodide.setStderr({ batched: (s) => captured.push(s) });

    const result = await pyodide.runPythonAsync(code);
    let outText = captured.join("") || String(result || "✅ Python executed.");
    setOutputs((prev) => ({ ...prev, [idx]: outText }));
  } catch (err) {
    setOutputs((prev) => ({ ...prev, [idx]: `❌ ${err.message}` }));
  } finally {
    setRunning((s) => ({ ...s, [idx]: false }));
  }
  return;
}


      if (language === "go" || language === "golang") {
  setOutputs((prev) => ({
    ...prev,
    [idx]: "⏳ Preparing Go environment..."
  }));

  try {
    const payload = new URLSearchParams();
    payload.append("version", "2");
    payload.append("body", code);

    const resp = await fetch("https://go.dev/_/play/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: payload.toString(),
    });

    if (!resp.ok) throw new Error("Go API not reachable (CORS)");
    const data = await resp.json();

    if (data.Errors) {
      setOutputs((prev) => ({
        ...prev,
        [idx]: `❌ Go Compilation Error:\n${data.Errors}`,
      }));
    } else {
      const output = (data.Events || []).map((e) => e.Message || "").join("");
      setOutputs((prev) => ({
        ...prev,
        [idx]: output || "✅ Go executed successfully in browser sandbox.",
      }));
    }
  } catch (err) {
    // 🧠 Graceful fallback explanation
    const fallbackMessage =
      "⚠️ Inline Go execution isn't supported in this browser environment.\n\n" +
      "👉 Your code will now open in the official **Go Playground** for safe execution.\n\n" +
      "💡 Tip: To run Go locally, save this as `main.go` and use:\n" +
      "   go run main.go";

    setOutputs((prev) => ({
      ...prev,
      [idx]: fallbackMessage,
    }));

    // 🔗 Open in official Go Playground
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

      if (["c", "cpp", "java"].includes(language)) {
        window.open("https://onecompiler.com", "_blank");
        setOutputs((prev) => ({
          ...prev,
          [idx]: `Opened ${language.toUpperCase()} editor (OneCompiler).`,
        }));
        setRunning((s) => ({ ...s, [idx]: false }));
        return;
      }

      setOutputs((prev) => ({
        ...prev,
        [idx]: `⚠️ In-browser execution not supported for ${language}.`,
      }));
    } catch (outerErr) {
      setOutputs((prev) => ({ ...prev, [idx]: `❌ Unexpected error: ${outerErr.message}` }));
    } finally {
      setRunning((s) => ({ ...s, [idx]: false }));
    }
  };

  // Scroll Spy
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
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const goPrev = () =>
    lessonIndex > 0 &&
    navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex - 1].slug}`);
  const goNext = () =>
    lessonIndex < lessons.length - 1 &&
    navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex + 1].slug}`);
  const handleCopy = (value, idx) => {
    navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };
const handleComplete = () => {
  if (user && isNextLesson && enrolledCourses.includes(courseSlug)) {
    completeLesson(courseSlug, lessonSlug);
    // award persona points for completing this lesson
    const deltas = quickLessonPersonaDelta(lesson);
    if (Object.keys(deltas).length) {
      updatePersonaScore(deltas);
    }
  } else {
    // user tried to complete a locked lesson
    // (you already have toast handling in CourseDetail; for LessonDetail you said you added toast state)
    // show toast if you have a showToast available, otherwise no-op
  }
};


  const SimulationLoader = () => (
    <div className="animate-pulse bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-md">
      <div className="h-5 bg-indigo-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-3 bg-indigo-100 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
      <div className="h-3 bg-indigo-100 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
      <div className="h-48 bg-indigo-50 dark:bg-gray-800 rounded-lg"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-sans lg:flex lg:gap-8">
      <div className="flex-1 space-y-12">
        {/* Header */}
        <div className="mb-12 bg-gradient-to-r from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-6 rounded-2xl shadow-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-200 tracking-tight">
            {lesson.title}
          </h1>
          <span className="text-sm sm:text-base text-indigo-700 dark:text-indigo-300 font-medium">
            Lesson {lessonIndex + 1} of {lessons.length}
          </span>
        </div>

        {/* 🧩 Lesson Content */}
        {lesson.content.map((block, idx) => (
          <div key={idx} ref={(el) => (sectionRefs.current[idx] = el)} id={`section-${idx}`}>
            {/* Text */}
            {block.type === "text" && (
              <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed text-justify space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {block.value}
                </ReactMarkdown>
              </div>
            )}

            {/* Image */}
            {block.type === "image" && (
              <div className="flex justify-center my-6 transition-transform duration-300 hover:scale-105">
                <img
                  src={block.value}
                  alt={block.alt || "Lesson Image"}
                  className="rounded-xl shadow-lg max-w-full h-auto"
                />
              </div>
            )}

            {/* Code */}
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
                  {/* ✅ JSX Simulator for language: "jsx" */}
{block.language === "jsx" && (
  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
      ⚛️ JSX Code Detected — Launching React Simulator...
    </p>
    <Suspense fallback={<div className="animate-pulse text-gray-400">Loading JSX Simulator...</div>}>
      <ReactComponentSimulator defaultCode={block.value} />
    </Suspense>
  </div>
)}

                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                    onClick={() => handleCopy(block.value, idx)}
                    title="Copy to Clipboard"
                  >
                    <Copy size={18} />
                  </button>
                  {copiedIdx === idx && (
                    <div className="absolute top-3 right-10 text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 px-2 py-1 rounded">
                      Copied!
                    </div>
                  )}
                </div>

                {/* Runnable Code */}
                {block.runnable && (
                  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-4">
                    <textarea
                      value={codeInputs[idx] || block.value}
                      onChange={(e) => setCodeInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                      rows={6}
                      className="w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <button
                      onClick={() => handleRunCode(idx, block.language, block.value)}
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
                        : block.language === "python"
                        ? "Run Python Code"
                        : "Run Code"}
                    </button>
                    <pre className="p-3 bg-black rounded-md overflow-x-auto text-sm text-white font-mono">
                      {outputs[idx] || ""}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Component / Simulation */}
            {block.type === "component" && (
              <div className="my-10">
                <Suspense fallback={<SimulationLoader />}>
                  <block.value />
                </Suspense>
              </div>
            )}
          </div>
        ))}

        {/* ✅ Lesson Completion */}
        {user && enrolledCourses.includes(courseSlug) && (
          <button
            onClick={handleComplete}
            disabled={!isNextLesson}
            className={`px-6 py-3 rounded-lg font-semibold mt-6 ${
              isNextLesson
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {isNextLesson ? "Mark Lesson as Complete ✅" : "Lesson Locked 🔒"}
          </button>
        )}

        {/* 🧪 Lab Access Teaser */}
        {user && !enrolledCourses.includes(courseSlug) && (
          <div className="text-center mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 rounded-2xl shadow-lg border border-green-200 dark:border-green-700">
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
              🧪 Hands-On Lab Available for This Lesson!
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              Want to apply what you just learned in a real-world environment?  
              Try the interactive lab designed for this topic — directly from your browser.
            </p>
            <button
              onClick={() => navigate("/labs")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
            >
              Access Lab Environment 🔓
            </button>
          </div>
        )}

        {/* 🚀 Enroll CTA */}
        <div className="text-center mt-10 p-6 bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-2xl shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
            🚀 Want to go deeper?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Enroll in the full <strong>{lesson.title}</strong> course for hands-on labs, mentor support, and certification.
          </p>
          <button
  onClick={() => navigate(`/enroll/${courseSlug}`)}
  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
>
  Enroll for Deep Dive & Certification
</button>

        </div>

        {/* 🔒 Lab Access Button */}
        <div className="text-center mt-6">
          {user ? (
            enrolledCourses.includes(courseSlug) ? (
             <button
  onClick={() => navigate("/labs")}
  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
>
  🧪 Access Lab Environment
</button>

            ) : (
              <button
                onClick={() => navigate("/enroll")}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all"
              >
                🔒 Upgrade to Unlock Lab Access
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              🔐 Login to Access Labs
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={goPrev}
            disabled={lessonIndex === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition shadow-md duration-200 ${
              lessonIndex === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
            }`}
          >
            ← Previous Lesson
          </button>
          <Link
            to={`/courses/${courseSlug}`}
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition shadow-md"
          >
            ← Back to Course
          </Link>
          <button
            onClick={goNext}
            disabled={lessonIndex === lessons.length - 1}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition shadow-md duration-200 ${
              lessonIndex === lessons.length - 1
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
            }`}
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-64 sticky top-28 h-max border-l border-gray-200 dark:border-gray-700 pl-6">
        <h4 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
          Lesson Contents
        </h4>
        <ul className="space-y-2 text-sm">
          {lesson.content.map((block, idx) => (
            <li
              key={idx}
              className={`cursor-pointer p-2 rounded-md transition ${
                activeSection === idx
                  ? "bg-indigo-100 dark:bg-indigo-700 font-semibold"
                  : "hover:bg-indigo-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => scrollToSection(idx)}
            >
              {block.title || `Section ${idx + 1}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
