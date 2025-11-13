// src/components/simulations/global/ReactComponentSimulator.jsx
import React, { useState, useEffect, useRef } from "react";
import * as Babel from "@babel/standalone";
import { Play, RotateCcw } from "lucide-react";

export default function ReactComponentSimulator({ defaultCode = "" }) {
  const [code, setCode] = useState(defaultCode || `function Hello() {
  return <h1>Hello from JSX Simulator 👋</h1>;
}

ReactDOM.render(<Hello />, document.getElementById("root"));`);
  const [error, setError] = useState("");
  const iframeRef = useRef();

  // Executes the JSX code safely inside the iframe
  const runCode = () => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    try {
      setError("");

      const transformed = Babel.transform(code, {
        presets: ["react", "env"],
      }).code;

      const html = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 10px; color: #333; background: #fafafa; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script>${transformed}</script>
          </body>
        </html>`;
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

  useEffect(() => {
    runCode();
  }, []);

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-indigo-200 dark:border-indigo-700 shadow-lg p-6">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
        ⚛️ React JSX Live Simulator
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
        Edit the JSX code below and click <b>Run</b> to see your component render in real-time.
      </p>

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
