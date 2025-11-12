// src/components/simulations/ThreatMapSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * ThreatMapSimulator
 * Simple animated map-like visualization that shows simulated attack flows.
 * Learners can toggle show/hide attack types.
 */
export default function ThreatMapSimulator() {
  const [running, setRunning] = useState(false);
  const attackTypes = [
    { id: "ransom", label: "Ransomware", color: "bg-red-400" },
    { id: "phish", label: "Phishing", color: "bg-yellow-400" },
    { id: "botnet", label: "Botnet", color: "bg-green-400" },
  ];
  const [visible, setVisible] = useState({ ransom: true, phish: true, botnet: true });

  const toggle = (id) => setVisible((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-indigo-700">🌐 Threat Map Simulator</h3>

      <div className="flex gap-2 mb-4 flex-wrap">
        {attackTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`px-3 py-1 rounded text-sm font-medium ${visible[t.id] ? "ring-2 ring-indigo-200" : "bg-gray-50"} `}
          >
            {t.label}
          </button>
        ))}
        <button onClick={() => setRunning((r) => !r)} className={`px-3 py-1 rounded text-sm bg-blue-600 text-white`}>{running ? "Stop" : "Start"} Simulation</button>
      </div>

      <div className="relative h-48 bg-gradient-to-b from-gray-50 to-white rounded-lg overflow-hidden border border-gray-100">
        {/* simplified "map" — animated arcs */}
        {running && visible.ransom && (
  <motion.div
    initial={{ left: "0%", opacity: 0 }}
    animate={{ left: "95%", opacity: 1 }}
    transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    className="absolute top-6 w-2 h-2 rounded-full bg-red-400 shadow"
  />
)}

        {running && visible.phish && (
  <motion.div
    initial={{ left: "0%", opacity: 0 }}
    animate={{ left: "95%", opacity: 1 }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.4 }}
    className="absolute top-20 w-2 h-2 rounded-full bg-yellow-400 shadow"
  />
)}

        {running && visible.botnet && (
  <motion.div
    initial={{ left: "0%", opacity: 0 }}
    animate={{ left: "95%", opacity: 1 }}
    transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.8 }}
    className="absolute top-32 w-2 h-2 rounded-full bg-green-400 shadow"
  />
)}

        <div className="absolute bottom-2 right-2 text-xs text-gray-400">Simulated flows — not real data</div>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        Use this to visualize how different attack campaigns may appear on a threat map and to explain origin → target relationships.
      </div>
    </div>
  );
}
