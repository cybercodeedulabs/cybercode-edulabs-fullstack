// src/components/simulations/PacketTimelineSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * PacketTimelineSimulator
 * Visual timeline of several packets passing across with simple filtering.
 */
export default function PacketTimelineSimulator() {
  const [running, setRunning] = useState(false);
  const [packets, setPackets] = useState([]);

  const spawnPacket = (type = "normal") => {
    const id = Date.now();
    setPackets((p) => [...p.slice(-8), { id, type, time: new Date().toLocaleTimeString() }]);
    // auto-remove after 3.5s
    setTimeout(() => setPackets((p) => p.filter((x) => x.id !== id)), 3600);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-indigo-700">📊 Packet Timeline Visualizer</h3>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setRunning((r) => !r); if (!running) spawnPacket("normal"); }} className="px-3 py-2 rounded bg-blue-600 text-white">
          {running ? "Stop" : "Start"} Live
        </button>
        <button onClick={() => spawnPacket("normal")} className="px-3 py-2 rounded bg-gray-100">Spawn Normal</button>
        <button onClick={() => spawnPacket("suspicious")} className="px-3 py-2 rounded bg-red-100">Spawn Suspicious</button>
      </div>

      <div className="relative h-40 bg-gray-50 rounded p-4 overflow-hidden">
        {/* timeline area */}
        <div className="absolute inset-0 flex items-center space-x-2 px-4">
          {packets.map((pkt) => (
            <motion.div
              key={pkt.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: "100%", opacity: 1 }}
              transition={{ duration: 3 }}
              className={`h-3 w-3 rounded-full ${pkt.type === "suspicious" ? "bg-red-400" : "bg-green-400"}`}
            />
          ))}
        </div>
        <div className="absolute bottom-2 left-4 text-xs text-gray-500">Packets animate left → right (auto expire)</div>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        Use this to show bursts, normal vs suspicious packets, and how an IDS might highlight anomalies.
      </div>
    </div>
  );
}
