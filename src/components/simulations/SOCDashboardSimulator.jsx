// src/components/simulations/SOCDashboardSimulator.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * SOCDashboardSimulator.jsx
 * -------------------------------------------------------
 * Visual simulation of SOC alert flow and event dashboard.
 * Displays simulated events, severity levels, and timeline activity.
 */

const SOCDashboardSimulator = () => {
  const [events, setEvents] = useState([]);
  const [running, setRunning] = useState(false);

  const sampleEvents = [
    { source: "Firewall", message: "Port scan detected from 192.168.10.24", severity: "High" },
    { source: "IDS", message: "Suspicious SSH brute-force attempt", severity: "Critical" },
    { source: "Endpoint", message: "Malware quarantined on host WS-22", severity: "Medium" },
    { source: "SIEM", message: "Failed logins correlated across 3 systems", severity: "High" },
    { source: "Cloud IAM", message: "Unauthorized API call from untrusted IP", severity: "Critical" },
  ];

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        setEvents((prev) => [
          { ...randomEvent, id: Date.now(), time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 9),
        ]);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        🧭 SOC Dashboard Simulator
      </h2>

      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setRunning(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          disabled={running}
        >
          Start Simulation
        </button>
        <button
          onClick={() => setRunning(false)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Stop Simulation
        </button>
      </div>

      {/* Animated Event Timeline */}
      <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No alerts yet. Click "Start Simulation" to begin monitoring...
          </p>
        ) : (
          events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-2 p-3 rounded-md text-sm shadow-sm ${
                event.severity === "Critical"
                  ? "bg-red-100 border-l-4 border-red-600 text-red-800"
                  : event.severity === "High"
                  ? "bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800"
                  : "bg-green-100 border-l-4 border-green-600 text-green-800"
              }`}
            >
              <strong>{event.time}</strong> — <em>{event.source}</em> → {event.message}
            </motion.div>
          ))
        )}
      </div>

      {/* SOC Summary Panel */}
      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 p-4 rounded-xl text-sm">
        <strong>🧩 Simulation Insight:</strong>  
        As events appear, analysts correlate them across systems to identify attack patterns.
        This dashboard demonstrates how SIEM and SOC teams triage security alerts in real time.
      </div>
    </div>
  );
};

export default SOCDashboardSimulator;
