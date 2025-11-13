import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

export default function ReactComponentSimulator({ defaultCode = "" }) {
  const [Babel, setBabel] = useState(null);
  const [code, setCode] = useState(
    defaultCode ||
      `function Greeting() {
  const [name, setName] = React.useState("Developer");
  return (
    <div>
      <h1>Hello, {name} 👋</h1>
      <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}`
  );
  const [error, setError] = useState("");
  const iframeRef = useRef();

  // ✅ Load Babel dynamically
  useEffect(() => {
    const loadBabel = async () => {
      if (window.Babel) {
        setBabel(window.Babel);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@babel/standalone@7.24.5/babel.min.js";
      script.onload = () => setBabel(window.Babel);
      document.body.appendChild(script);
    };
    loadBabel();
  }, []);

  // ✅ Function to safely run JSX code
  const runCode = () => {
    if (!Babel) {
      setError("⏳ Loading Babel runtime... please wait a second.");
      return;
    }

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    try {
      setError("");

      // 🧹 1️⃣ Clean imports/exports
      let cleanedCode = code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, "")
        .replace(/export\s+default\s+/g, "")
        .replace(/export\s+\{.*?\};?/g, "");

      // 🪄 2️⃣ Auto-render if no ReactDOM.render present
      if (!/ReactDOM\.render/.test(cleanedCode) && /function\s+[A-Z]/.test(cleanedCode)) {
        const componentName = cleanedCode.match(/function\s+([A-Z]\w*)/)?.[1];
        if (componentName) {
          cleanedCode += `\nReactDOM.render(React.createElement(${componentName}), document.getElementById("root"));`;
        }
      }

      // 🧩 3️⃣ Auto-fix common React hooks (useState → React.useState)
cleanedCode = cleanedCode
  .replace(/\buseState\b/g, "React.useState")
  .replace(/\buseEffect\b/g, "React.useEffect")
  .replace(/\buseRef\b/g, "React.useRef")
  .replace(/\buseContext\b/g, "React.useContext")
  .replace(/\buseReducer\b/g, "React.useReducer")
  .replace(/\buseMemo\b/g, "React.useMemo")
  .replace(/\buseCallback\b/g, "React.useCallback");

      // ⚡ 3️⃣ Transform JSX → plain JS
      const transformed = Babel.transform(cleanedCode, {
        presets: ["react", "env"],
      }).code;

      // 🧱 4️⃣ Build proper HTML (with DOCTYPE)
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>React Simulator</title>
            <style>
              body {
                font-family: sans-serif;
                padding: 10px;
                background: #fafafa;
                color: #222;
              }
              input {
                padding: 6px;
                margin-top: 6px;
                border-radius: 6px;
                border: 1px solid #ccc;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script>
              try {
                ${transformed}
              } catch (err) {
                document.body.innerHTML = '<pre style="color:red;">' + err + '</pre>';
              }
            </script>
          </body>
        </html>
      `;

      // 🚀 5️⃣ Inject and execute
      doc.open();
      doc.write(html);
      doc.close();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetCode = () => {
    setCode(defaultCode);
    setError("");
  };

  // Auto-run when Babel first loads
  useEffect(() => {
    if (Babel) runCode();
  }, [Babel]);

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-indigo-200 dark:border-indigo-700 shadow-lg p-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
        ⚛️ React JSX Live Simulator
      </h3>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10}
        className="w-full p-3 text-sm font-mono bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
      />

      <div className="flex justify-end mt-3 gap-3">
        <button
          onClick={runCode}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Play size={16} /> Run
        </button>
        <button
          onClick={resetCode}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg font-medium"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
          🧩 Output Preview
        </h4>
        <iframe
          ref={iframeRef}
          title="JSX Output"
          className="w-full h-56 border rounded-lg bg-white dark:bg-gray-900"
        />
        {error && (
          <div className="mt-3 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded">
            ⚠️ Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
