// src/components/simulations/SIEMLogAnalyzerSimulator.jsx
import React, { useState } from "react";

/**
 * SIEMLogAnalyzerSimulator.jsx
 * -------------------------------------------------
 * Simulates a basic SIEM dashboard that displays incoming log events
 * and lets the learner identify and respond to suspicious activities.
 */

export default function SIEMLogAnalyzerSimulator() {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState("");

  const sampleLogs = [
    { time: "10:02:14", event: "User login - admin@web01", level: "INFO" },
    { time: "10:02:31", event: "Failed login attempt - root@db01", level: "WARN" },
    { time: "10:03:02", event: "Multiple failed SSH logins from 192.168.1.54", level: "ALERT" },
    { time: "10:03:18", event: "Privilege escalation - sudo access granted", level: "ALERT" },
    { time: "10:03:25", event: "File modified: /etc/passwd", level: "CRITICAL" },
    { time: "10:04:10", event: "Security service restarted - IDS", level: "INFO" },
  ];

  const startSimulation = () => {
    setIsRunning(true);
    setLogs([]);
    setAlert("");
    let i = 0;
    const interval = setInterval(() => {
      if (i >= sampleLogs.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }
      const newLog = sampleLogs[i];
      setLogs((prev) => [...prev, newLog]);
      if (newLog.level === "CRITICAL") {
        setAlert("🚨 Incident Detected: Unauthorized file modification!");
      }
      i++;
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
        🕵️ SIEM Log Analyzer Simulator
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        Simulate log flow from multiple systems and detect security incidents in real-time.
      </p>
      <button
        onClick={startSimulation}
        disabled={isRunning}
        className={`px-6 py-2 rounded-md font-medium text-white ${
          isRunning ? "bg-indigo-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isRunning ? "Simulating..." : "Start Simulation"}
      </button>

      <div className="mt-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No logs yet...</p>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={`py-1 ${
                log.level === "CRITICAL"
                  ? "text-red-600 dark:text-red-400 font-bold"
                  : log.level === "ALERT"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              [{log.time}] {log.level}: {log.event}
            </div>
          ))
        )}
      </div>

      {alert && (
        <div className="mt-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 p-3 rounded-md text-center font-semibold">
          {alert}
        </div>
      )}
    </div>
  );
}
