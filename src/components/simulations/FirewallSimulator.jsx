// src/components/simulations/FirewallSimulator.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FirewallSimulator.jsx (Enhanced + Live Packet Console)
 * -------------------------------------------------------
 * Visual + Interactive simulation for teaching Firewalls, IDS & IPS.
 * Includes:
 * - Multi-packet trail animation for ALLOW
 * - Burst-stop animation for BLOCKED
 * - IDS alert triggering
 * - Real-time packet log console (timestamped)
 */

const FirewallSimulator = () => {
  const initialRules = { 22: "ALLOW", 80: "DENY", 443: "ALLOW" };
  const [rules, setRules] = useState(initialRules);
  const [selectedPort, setSelectedPort] = useState(22);
  const [result, setResult] = useState("");
  const [blockedCount, setBlockedCount] = useState({});
  const [packetAnimating, setPacketAnimating] = useState(false);
  const [alert, setAlert] = useState("");
  const [packetTrail, setPacketTrail] = useState([]);
  const [logs, setLogs] = useState([]); // 🧠 new log state

  const toggleRule = (port) => {
    setRules({
      ...rules,
      [port]: rules[port] === "ALLOW" ? "DENY" : "ALLOW",
    });
  };

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { time: timestamp, message, type };
    setLogs((prev) => [...prev.slice(-7), logEntry]); // keep last 7 logs
  };

  const handleSendPacket = () => {
    const action = rules[selectedPort];
    let message = "";

    if (action === "ALLOW") {
      message = `✅ Connection to port ${selectedPort} ALLOWED`;
      addLog(`Packet to port ${selectedPort}: ALLOWED ✅`, "success");
    } else {
      message = `❌ Connection to port ${selectedPort} BLOCKED`;
      addLog(`Packet to port ${selectedPort}: BLOCKED ❌`, "error");

      const newCount = { ...blockedCount };
      newCount[selectedPort] = (newCount[selectedPort] || 0) + 1;
      setBlockedCount(newCount);

      // IDS Alert trigger
      if (newCount[selectedPort] >= 3) {
        const alertMsg = `⚠️ IDS Alert: Multiple blocked attempts on port ${selectedPort}`;
        setAlert(alertMsg);
        addLog(alertMsg, "warning");
      }
    }

    setResult(message);
    setPacketAnimating(true);

    if (action === "ALLOW") {
      const trail = Array.from({ length: 5 }, (_, i) => i);
      setPacketTrail(trail);
    } else {
      setPacketTrail([]);
    }

    // Reset after animation
    setTimeout(() => {
      setPacketAnimating(false);
      setPacketTrail([]);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
        🔒 Firewall Rule Visualizer (with Live Packet Log)
      </h2>

      {/* Rule Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-blue-50 text-gray-700">
            <th className="border p-2">Port</th>
            <th className="border p-2">Protocol</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rules).map((port) => (
            <tr key={port}>
              <td className="border p-2 text-center font-mono">{port}</td>
              <td className="border p-2 text-center">TCP</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => toggleRule(port)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    rules[port] === "ALLOW"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {rules[port]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Packet Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <select
          className="border rounded-md p-2 text-gray-700"
          value={selectedPort}
          onChange={(e) => setSelectedPort(Number(e.target.value))}
        >
          {Object.keys(rules).map((port) => (
            <option key={port} value={port}>
              Port {port}
            </option>
          ))}
        </select>
        <button
          onClick={handleSendPacket}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send Packet
        </button>
      </div>

      {/* Animation Track */}
      <div className="relative flex items-center justify-between w-full mt-6 mb-4 px-6">
        {/* Client */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            💻
          </div>
          <span className="text-xs mt-1">Client</span>
        </div>

        {/* Track */}
        <div className="relative flex-1 h-1 mx-4 bg-gray-300 rounded-full overflow-hidden">
          {/* Main Packet */}
          <AnimatePresence>
            {packetAnimating && (
              <motion.div
                key={`main-${selectedPort}`}
                initial={{ x: 0, scale: 0.8 }}
                animate={
                  rules[selectedPort] === "ALLOW"
                    ? { x: "100%", scale: 1 }
                    : { x: "50%", scale: 1.3 }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className={`absolute left-0 top-[-5px] h-3 w-3 rounded-full shadow-md ${
                  rules[selectedPort] === "ALLOW" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            )}
          </AnimatePresence>

          {/* Trail Dots for ALLOW */}
          {packetTrail.map((i) => (
            <motion.div
              key={i}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: "100%", opacity: [0.2, 1, 0] }}
              transition={{
                delay: i * 0.15,
                duration: 1.8,
                ease: "easeInOut",
              }}
              className="absolute left-0 top-[-5px] h-2 w-2 rounded-full bg-green-400"
            />
          ))}

          {/* Burst stop for BLOCKED */}
          {packetAnimating && rules[selectedPort] === "DENY" && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [1.5, 2, 0], opacity: [1, 0.5, 0] }}
              transition={{ duration: 0.8 }}
              className="absolute left-1/2 top-[-6px] h-4 w-4 bg-red-500 rounded-full"
            />
          )}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            🖥️
          </div>
          <span className="text-xs mt-1">Server</span>
        </div>
      </div>

      {/* Result Display */}
      <div
        className={`text-center font-semibold ${
          result.includes("ALLOWED")
            ? "text-green-600"
            : result.includes("BLOCKED")
            ? "text-red-600"
            : "text-gray-700"
        }`}
      >
        {result || "No packets sent yet."}
      </div>

      {/* IDS Alert */}
      {alert && (
        <div className="mt-4 text-yellow-600 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-center">
          {alert}
        </div>
      )}

      {/* 🧠 Live Packet Log Console */}
      <div className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm shadow-inner border border-gray-700">
        <h3 className="text-green-400 font-semibold mb-2">🖥️ Live Packet Log</h3>
        {logs.length === 0 && (
          <div className="text-gray-500 italic">No activity yet...</div>
        )}
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`py-1 border-b border-gray-800 ${
              log.type === "success"
                ? "text-green-400"
                : log.type === "error"
                ? "text-red-400"
                : log.type === "warning"
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            <span className="text-gray-500 mr-2">[{log.time}]</span>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirewallSimulator;
