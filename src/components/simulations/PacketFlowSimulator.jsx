// src/components/simulations/PacketFlowSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * PacketFlowSimulator
 * Simulates a TCP 3-way handshake with simple controls.
 */
export default function PacketFlowSimulator() {
  const [stage, setStage] = useState(0); // 0=idle,1=syn,2=syn-ack,3=ack,4=established
  const [log, setLog] = useState([]);

  const step = () => {
    const next = Math.min(stage + 1, 4);
    setStage(next);
    const messages = ["Start", "SYN sent", "SYN-ACK received", "ACK sent", "Connection Established"];
    setLog((l) => [...l.slice(-3), `${new Date().toLocaleTimeString()} — ${messages[next]}`]);
  };

  const reset = () => {
    setStage(0);
    setLog([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-indigo-700">🔁 Packet Flow Simulator (TCP Handshake)</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="mb-2">Client</div>
            <div className="h-10 flex items-center justify-center rounded bg-gray-50">💻</div>
          </div>

          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded relative overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: stage === 0 ? "0%" : stage === 1 ? "25%" : stage === 2 ? "60%" : stage === 3 ? "85%" : "100%" }}
                transition={{ duration: 0.8 }}
                className="h-full bg-indigo-400"
              />
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              {stage === 0 && "Idle"}{stage === 1 && "SYN"}{stage === 2 && "SYN-ACK"}{stage === 3 && "ACK"}{stage === 4 && "Established"}
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="mb-2">Server</div>
            <div className="h-10 flex items-center justify-center rounded bg-gray-50">🖥️</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={step} className="px-3 py-2 rounded bg-indigo-600 text-white">Next Step</button>
        <button onClick={reset} className="px-3 py-2 rounded bg-gray-100">Reset</button>
      </div>

      <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
        <div className="font-semibold mb-2">Handshake Log</div>
        <div className="space-y-1">
          {log.length === 0 && <div className="text-gray-400">No handshake activity yet.</div>}
          {log.map((l, i) => (<div key={i} className="text-xs">{l}</div>))}
        </div>
      </div>
    </div>
  );
}
