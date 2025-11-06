// src/pages/LessonDetail.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonsData from "../data/lessonsData";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef } from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useUser } from "../contexts/UserContext";

export default function LessonDetail() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [codeInputs, setCodeInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  const { user, enrolledCourses, courseProgress, completeLesson } = useUser();

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const lessons = lessonsData[courseSlug] || [];
  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessons[lessonIndex];
  const progress = courseProgress[courseSlug]?.currentLessonIndex || 0;
  const isNextLesson = lessonIndex === progress;

  if (!lesson) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Lesson not found</h2>
        <p className="mt-4">
          The lesson you're looking for doesn't exist.{" "}
          <Link to={`/courses/${courseSlug}`} className="text-indigo-600 underline hover:text-indigo-500 transition">
            Go back to course
          </Link>
        </p>
      </div>
    );
  }

  // Scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(idx);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (idx) => sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goPrev = () => lessonIndex > 0 && navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex - 1].slug}`);
  const goNext = () => lessonIndex < lessons.length - 1 && navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex + 1].slug}`);

  const handleRunCode = (idx, language) => {
    const code = codeInputs[idx] || "";

    if (language === "javascript") {
      try {
        const result = eval(code);
        setOutputs((prev) => ({ ...prev, [idx]: String(result) || "✅ Code executed successfully (no output)" }));
      } catch (err) {
        setOutputs((prev) => ({ ...prev, [idx]: String(err) }));
      }
      return;
    }

    if (language === "go" || language === "golang") {
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
      setOutputs((prev) => ({ ...prev, [idx]: "Opened in Go Playground with code preloaded." }));
      return;
    }

    if (language === "python") {
      window.open("https://replit.com/new/python3", "_blank");
      setOutputs((prev) => ({ ...prev, [idx]: "Opened in Replit Python runner (code cannot be prefilled)." }));
      return;
    }

    if (["c", "cpp", "java"].includes(language)) {
      window.open("https://onecompiler.com", "_blank");
      setOutputs((prev) => ({ ...prev, [idx]: `Opened ${language.toUpperCase()} editor in OneCompiler.` }));
      return;
    }

    setOutputs((prev) => ({ ...prev, [idx]: `Execution for ${language} is not supported in this environment.` }));
  };

  const handleCopy = (value, idx) => {
    navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleComplete = () => {
    if (user && isNextLesson && enrolledCourses.includes(courseSlug)) {
      completeLesson(courseSlug, lessonSlug);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-sans lg:flex lg:gap-8">
      <div className="flex-1 space-y-12">
        {/* Lesson Banner */}
        <div className="mb-12 bg-gradient-to-r from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 p-6 rounded-2xl shadow-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-200 tracking-tight">{lesson.title}</h1>
          <span className="text-sm sm:text-base text-indigo-700 dark:text-indigo-300 font-medium">
            Lesson {lessonIndex + 1} of {lessons.length}
          </span>
        </div>

        {/* Lesson Content */}
        {lesson.content.map((block, idx) => (
          <div key={idx} ref={(el) => (sectionRefs.current[idx] = el)} id={`section-${idx}`}>
            {block.type === "text" && (
              <div className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed text-justify space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {block.value}
                </ReactMarkdown>
              </div>
            )}

            {block.type === "image" && (
              <div className="flex justify-center my-6 transition-transform duration-300 hover:scale-105">
                <img src={block.value} alt={block.alt || "Lesson Image"} className="rounded-xl shadow-lg max-w-full h-auto" />
              </div>
            )}

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
                  <SyntaxHighlighter language={block.language} style={darkMode ? oneDark : oneLight} className="!p-4 !text-sm" showLineNumbers>
                    {block.value}
                  </SyntaxHighlighter>
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

                {block.runnable && (
                  <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-4">
                    <textarea
                      value={codeInputs[idx] || block.value}
                      onChange={(e) => setCodeInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                      rows={6}
                      className="w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="Write your code here..."
                    />
                    <button
                      onClick={() => handleRunCode(idx, block.language)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
                    >
                      {block.language === "go" ? "Open in Go Playground" : block.language === "python" ? "Open in Python Runner" : "Run Code"}
                    </button>
                    <pre className="p-3 bg-black rounded-md overflow-x-auto text-sm text-white font-mono">{outputs[idx] || ""}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Complete Lesson Button */}
        {user && enrolledCourses.includes(courseSlug) && (
          <button
            onClick={handleComplete}
            disabled={!isNextLesson}
            className={`px-6 py-3 rounded-lg font-semibold mt-6 ${
              isNextLesson ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {isNextLesson ? "Mark Lesson as Complete ✅" : "Lesson Locked 🔒"}
          </button>
        )}

        {/* Navigation Buttons */}
        <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={goPrev}
            disabled={lessonIndex === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition shadow-md duration-200 ${
              lessonIndex === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
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
              lessonIndex === lessons.length - 1 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
            }`}
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* Sticky TOC */}
      <div className="hidden lg:block w-64 sticky top-28 h-max border-l border-gray-200 dark:border-gray-700 pl-6">
        <h4 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Lesson Contents</h4>
        <ul className="space-y-2 text-sm">
          {lesson.content.map((block, idx) => (
            <li
              key={idx}
              className={`cursor-pointer p-2 rounded-md transition ${
                activeSection === idx ? "bg-indigo-100 dark:bg-indigo-700 font-semibold" : "hover:bg-indigo-50 dark:hover:bg-gray-700"
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
