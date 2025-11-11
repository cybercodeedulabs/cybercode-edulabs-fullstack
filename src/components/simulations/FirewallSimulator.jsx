// src/components/simulations/FirewallSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * FirewallSimulator.jsx
 * -------------------------------------------------------
 * Visual simulation of packet traversal through a firewall.
 * Learners can toggle Allow/Deny per port, send packets,
 * and observe whether traffic is allowed, blocked, or triggers IDS alerts.
 */

const FirewallSimulator = () => {
  const initialRules = {
    22: "ALLOW",
    80: "DENY",
    443: "ALLOW",
  };

  const [rules, setRules] = useState(initialRules);
  const [selectedPort, setSelectedPort] = useState(22);
  const [result, setResult] = useState("");
  const [blockedCount, setBlockedCount] = useState({});
  const [packetKey, setPacketKey] = useState(0); // for re-triggering animation
  const [alert, setAlert] = useState("");

  const toggleRule = (port) => {
    setRules({
      ...rules,
      [port]: rules[port] === "ALLOW" ? "DENY" : "ALLOW",
    });
  };

  const handleSendPacket = () => {
    const action = rules[selectedPort];
    let message = "";

    if (action === "ALLOW") {
      message = `✅ Connection to port ${selectedPort} ALLOWED`;
    } else {
      message = `❌ Connection to port ${selectedPort} BLOCKED`;
      const newCount = { ...blockedCount };
      newCount[selectedPort] = (newCount[selectedPort] || 0) + 1;
      setBlockedCount(newCount);

      // IDS Alert trigger
      if (newCount[selectedPort] >= 3) {
        setAlert(
          `⚠️ IDS Alert: Multiple blocked attempts detected on port ${selectedPort}`
        );
      }
    }

    setResult(message);
    setPacketKey(packetKey + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
        🔒 Firewall Rule Visualizer
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

      {/* Animation */}
      <div className="relative h-24 flex items-center justify-between mb-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            💻
          </div>
          <span className="text-xs mt-1">Client</span>
        </div>

        <div className="w-4/6 h-1 bg-gray-300 relative overflow-hidden rounded-md">
          <motion.div
            key={packetKey}
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`absolute left-0 top-0 w-5 h-5 rounded-full ${
              rules[selectedPort] === "ALLOW" ? "bg-green-500" : "bg-red-500"
            }`}
          ></motion.div>
        </div>

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
    </div>
  );
};

export default FirewallSimulator;
