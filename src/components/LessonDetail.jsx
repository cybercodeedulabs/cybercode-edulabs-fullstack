import { useParams, Link, useNavigate } from "react-router-dom";
import lessonsData from "../data/lessonsData";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function LessonDetail() {
  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [codeInputs, setCodeInputs] = useState({});
  const [outputs, setOutputs] = useState({});
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const lessons = lessonsData[courseSlug] || [];
  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessons[lessonIndex];

  if (!lesson) {
    return (
      <div className="text-center py-20 text-red-600">
        <h2 className="text-3xl font-bold">Lesson not found</h2>
        <p className="mt-4">
          The lesson you're looking for doesn't exist.{" "}
          <Link to={`/courses/${courseSlug}`} className="text-indigo-600 underline">
            Go back to course
          </Link>
        </p>
      </div>
    );
  }

  const goPrev = () => {
    if (lessonIndex > 0) {
      navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex - 1].slug}`);
    }
  };

  const goNext = () => {
    if (lessonIndex < lessons.length - 1) {
      navigate(`/courses/${courseSlug}/lessons/${lessons[lessonIndex + 1].slug}`);
    }
  };

  const handleRunCode = (idx, language) => {
    const code = codeInputs[idx] || "";

    if (language === "javascript") {
      try {
        const result = eval(code);
        setOutputs((prev) => ({
          ...prev,
          [idx]: String(result) || "✅ Code executed successfully (no output)",
        }));
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

      setOutputs((prev) => ({
        ...prev,
        [idx]: "Opened in Go Playground with code preloaded.",
      }));
      return;
    }

    if (language === "python") {
      window.open("https://replit.com/new/python3", "_blank");
      setOutputs((prev) => ({
        ...prev,
        [idx]: "Opened in Replit Python runner (code cannot be prefilled).",
      }));
      return;
    }

    if (["c", "cpp", "java"].includes(language)) {
      window.open("https://onecompiler.com", "_blank");
      setOutputs((prev) => ({
        ...prev,
        [idx]: `Opened ${language.toUpperCase()} editor in OneCompiler.`,
      }));
      return;
    }

    setOutputs((prev) => ({
      ...prev,
      [idx]: `Execution for ${language} is not supported in this environment.`,
    }));
  };

  const handleCopy = (value, idx) => {
    navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
      {/* 📘 Lesson Title Banner */}
      <div className="mb-10 bg-indigo-100 dark:bg-indigo-900 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 dark:text-indigo-200 tracking-tight">
          {lesson.title}
        </h1>
        <span className="text-sm sm:text-base text-indigo-700 dark:text-indigo-300 font-medium">
          Lesson {lessonIndex + 1} of {lessons.length}
        </span>
      </div>

      {/* 📚 Lesson Content */}
      <div className="space-y-10">
        {lesson.content.map((block, idx) => {
          if (block.type === "text") {
            return (
              <div
                key={idx}
                className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed text-justify"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {block.value}
                </ReactMarkdown>
              </div>
            );
          } else if (block.type === "image") {
            return (
              <div key={idx} className="flex justify-center my-6">
                <img
                  src={block.value}
                  alt={block.alt || "Lesson Image"}
                  className="rounded-xl shadow-md max-w-full h-auto"
                />
              </div>
            );
          } else if (block.type === "code") {
            return (
              <div
                key={idx}
                className="rounded-xl border dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 overflow-hidden"
              >
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

                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                    onClick={() => handleCopy(block.value, idx)}
                    title="Copy to Clipboard"
                  >
                    <Copy size={18} />
                    <span className="sr-only">Copy</span>
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
                      onChange={(e) =>
                        setCodeInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                      }
                      rows={6}
                      className="w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
                      placeholder="Write your code here..."
                    />

                    <button
                      onClick={() => handleRunCode(idx, block.language)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
                    >
                      {block.language === "go"
                        ? "Open in Go Playground"
                        : block.language === "python"
                        ? "Open in Python Runner"
                        : "Run Code"}
                    </button>

                    <div
                      className="p-3 bg-black rounded-md overflow-x-auto text-sm text-white font-mono"
                      dangerouslySetInnerHTML={{ __html: outputs[idx] || "" }}
                    ></div>
                  </div>
                )}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      {/* 🔄 Navigation */}
      <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={goPrev}
          disabled={lessonIndex === 0}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition ${
            lessonIndex === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          ← Previous Lesson
        </button>

        <Link
          to={`/courses/${courseSlug}`}
          className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-xl font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
        >
          ← Back to Course
        </Link>

        <button
          onClick={goNext}
          disabled={lessonIndex === lessons.length - 1}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition ${
            lessonIndex === lessons.length - 1
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Next Lesson →
        </button>
      </div>
    </div>
  );
}
