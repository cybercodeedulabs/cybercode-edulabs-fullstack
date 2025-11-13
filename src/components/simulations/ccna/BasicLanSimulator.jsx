// src/components/simulations/ccna/BasicLanSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function BasicLanSimulator() {
  const [pinging, setPinging] = useState(false);
  const [log, setLog] = useState([]);

  const devices = [
    { id: "PC1", type: "PC", ip: "192.168.1.10" },
    { id: "PC2", type: "PC", ip: "192.168.1.20" },
    { id: "Switch", type: "Switch" },
    { id: "Router", type: "Router", ip: "192.168.1.1" }
  ];

  const startPing = async () => {
    if (pinging) return;
    setPinging(true);
    setLog(["Starting Ping from PC1 to PC2..."]);

    const steps = [
      "🖥️ PC1 creates an ICMP packet destined for 192.168.1.20",
      "📡 Packet sent to Switch (Layer 2 frame based on MAC address)",
      "🔀 Switch checks MAC table → forwards frame to correct port",
      "🖥️ PC2 receives the packet and replies with ICMP Echo Reply",
      "✅ Ping successful — both hosts are communicating!"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      setLog((prev) => [...prev, steps[i]]);
    }

    setPinging(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-indigo-200 dark:border-gray-700 p-6 rounded-2xl shadow-md text-sm">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🧩 Basic LAN Simulator
      </h3>

      {/* Network topology */}
      <div className="relative flex flex-col items-center justify-center space-y-4 mb-6">
        <div className="flex items-center justify-center space-x-16">
          {devices.slice(0, 2).map((d) => (
            <motion.div
              key={d.id}
              className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-800 shadow-md border border-indigo-200 dark:border-indigo-700 text-center w-32"
              animate={{ scale: pinging ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">{d.id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">{d.ip}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800 shadow-md border border-blue-300 dark:border-blue-600 w-40 text-center"
          animate={{ scale: pinging ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Switch
        </motion.div>

        <motion.div
          className="p-3 rounded-xl bg-green-100 dark:bg-green-800 shadow-md border border-green-300 dark:border-green-700 w-40 text-center"
          animate={{ scale: pinging ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Router (192.168.1.1)
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex justify-center mb-4">
        <button
          onClick={startPing}
          disabled={pinging}
          className={`px-5 py-2 rounded-lg font-medium ${
            pinging
              ? "bg-indigo-400 cursor-wait text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {pinging ? "Pinging..." : "Send Ping from PC1 → PC2"}
        </button>
      </div>

      {/* Logs */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 h-40 overflow-y-auto font-mono text-xs text-gray-700 dark:text-gray-300">
        {log.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No packets sent yet.</p>
        ) : (
          log.map((line, i) => (
            <div key={i} className="my-1">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
