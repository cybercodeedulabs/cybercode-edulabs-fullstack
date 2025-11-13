import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const osiLayers = [
  { id: 7, name: "Application", color: "bg-pink-500", desc: "User applications like HTTP, DNS, FTP work here." },
  { id: 6, name: "Presentation", color: "bg-purple-500", desc: "Data encryption, compression, and formatting happen here." },
  { id: 5, name: "Session", color: "bg-indigo-500", desc: "Session establishment and management between systems." },
  { id: 4, name: "Transport", color: "bg-blue-500", desc: "End-to-end delivery using TCP/UDP with ports." },
  { id: 3, name: "Network", color: "bg-green-500", desc: "Routing and logical addressing (IP addresses)." },
  { id: 2, name: "Data Link", color: "bg-yellow-500", desc: "MAC addressing and framing handled here." },
  { id: 1, name: "Physical", color: "bg-red-500", desc: "Actual transmission of bits across cables or wireless signals." }
];

export default function OSIFlowSimulation() {
  const [message, setMessage] = useState("Ping 192.168.1.1");
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("send");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);

  const handleStart = () => {
    if (running) return;
    setRunning(true);
    setLog([]);
    setStep(0);
    setDirection("send");

    const flow = async () => {
      for (let i = osiLayers.length - 1; i >= 0; i--) {
        await new Promise((r) => setTimeout(r, 1200));
        setStep(i);
        setLog((prev) => [
          ...prev,
          `⬇️ ${osiLayers[i].name} Layer: ${osiLayers[i].desc}`
        ]);
      }

      await new Promise((r) => setTimeout(r, 1500));
      setDirection("receive");
      for (let i = 0; i < osiLayers.length; i++) {
        await new Promise((r) => setTimeout(r, 1200));
        setStep(i);
        setLog((prev) => [
          ...prev,
          `⬆️ ${osiLayers[i].name} Layer: Data decapsulated here.`
        ]);
      }

      setRunning(false);
    };

    flow();
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-300">
        🧠 OSI Model Data Flow Simulation
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
        This simulator visualizes how your data travels through all 7 OSI layers — from
        the Application down to the Physical layer, and back up again.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleStart}
          disabled={running}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            running ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {running ? "Simulating..." : "Start Flow"}
        </button>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
        {osiLayers.map((layer, i) => (
          <motion.div
            key={layer.id}
            animate={{
              scale:
                step === i
                  ? 1.1
                  : 1,
              opacity:
                step === i
                  ? 1
                  : 0.7
            }}
            transition={{ duration: 0.3 }}
            className={`${layer.color} text-white p-3 rounded-lg text-center font-semibold shadow-md`}
          >
            <div>{layer.name}</div>
            {step === i && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs mt-1 font-normal"
              >
                {direction === "send" ? "Encapsulating Data" : "Decapsulating Data"}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-black text-green-400 rounded-md text-sm font-mono overflow-y-auto max-h-48">
        <AnimatePresence>
          {log.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {entry}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-gray-600 dark:text-gray-400 mt-3 text-sm text-center">
        {running
          ? "Simulation running..."
          : "Simulation complete. You can modify the message and run again!"}
      </div>
    </div>
  );
}
