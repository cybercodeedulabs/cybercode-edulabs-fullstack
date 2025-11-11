// src/components/CodeRunner.jsx
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Editor from "@monaco-editor/react";
import runGo from "./runner/runGo";
import runPython from "./runner/runPython";
import runJS from "./runner/runJS";
import runViaAPI from "./runner/runViaAPI"; // placeholder for Stage 2

export default function CodeRunner({ language = "python", initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  async function handleRun() {
    setRunning(true);
    setOutput("");

    try {
      // Stage 2: detect backend automatically
      const backendAvailable = window.localStorage.getItem("cloudBackend") === "true";

      let result;
      if (backendAvailable) {
        result = await runViaAPI(language, code);
      } else {
        switch (language) {
          case "go":
            result = await runGo(code);
            break;
          case "python":
            result = await runPython(code);
            break;
          case "javascript":
          case "js":
            result = await runJS(code);
            break;
          default:
            result = { stdout: "", stderr: "Language not supported yet" };
        }
      }

      setOutput(result.stderr ? result.stderr : result.stdout);
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border rounded-2xl shadow-md p-4 my-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">
          Run {language.toUpperCase()} Code
        </h3>
        <Button onClick={handleRun} disabled={running}>
          {running ? "Running..." : "Run ▶"}
        </Button>
      </div>

      <Editor
        height="220px"
        defaultLanguage={language}
        value={code}
        theme="vs-dark"
        onChange={(v) => setCode(v)}
      />

      <div className="mt-3 bg-black text-green-400 p-2 rounded font-mono text-sm h-32 overflow-y-auto">
        {output || "Output will appear here..."}
      </div>
    </div>
  );
}
