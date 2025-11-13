import React, { useState, useEffect } from "react";

// PacketRoutingSimulator.jsx
// Path: /src/components/simulations/ccna/PacketRoutingSimulator.jsx

export default function PacketRoutingSimulator() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const steps = [
    {
      from: "PC (192.168.10.10)",
      to: "Router A (192.168.10.1)",
      info: "The source PC sends a packet to Router A — the default gateway.",
    },
    {
      from: "Router A (10.0.0.1)",
      to: "Router B (10.0.0.2)",
      info: "Router A checks its routing table and forwards to the next hop: Router B.",
    },
    {
      from: "Router B (172.16.0.1)",
      to: "Router C (172.16.0.2)",
      info: "Router B finds the best route in its table and sends to Router C.",
    },
    {
      from: "Router C (192.168.20.1)",
      to: "Web Server (192.168.20.10)",
      info: "Router C delivers the packet to the final destination in its directly connected network.",
    },
  ];

  const routingTables = {
    "Router A": [
      { destination: "192.168.10.0/24", nextHop: "—", interface: "G0/0" },
      { destination: "10.0.0.0/24", nextHop: "—", interface: "G0/1" },
      { destination: "192.168.20.0/24", nextHop: "10.0.0.2", interface: "G0/1" },
    ],
    "Router B": [
      { destination: "10.0.0.0/24", nextHop: "—", interface: "G0/0" },
      { destination: "172.16.0.0/24", nextHop: "—", interface: "G0/1" },
      { destination: "192.168.20.0/24", nextHop: "172.16.0.2", interface: "G0/1" },
    ],
    "Router C": [
      { destination: "172.16.0.0/24", nextHop: "—", interface: "G0/0" },
      { destination: "192.168.20.0/24", nextHop: "—", interface: "G0/1" },
    ],
  };

  useEffect(() => {
    let timer;
    if (isRunning && step < steps.length - 1) {
      timer = setTimeout(() => setStep((prev) => prev + 1), 3000);
    }
    return () => clearTimeout(timer);
  }, [isRunning, step]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setStep(0);
    setIsRunning(false);
  };

  const currentStep = steps[step];
  const activeRouter =
    step === 0 ? "Router A" : step === 1 ? "Router B" : step === 2 ? "Router C" : null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md space-y-6">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
        🌐 Packet Routing Simulator
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        Visualize how data travels across multiple routers using their routing tables to determine
        the next hop. Each step highlights the routing decision made by a router.
      </p>

      {/* Network Diagram */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 h-64 flex items-center justify-between">
        <div className="text-center text-xs font-semibold text-gray-800 dark:text-gray-200">
          💻<br />
          PC<br />
          192.168.10.10
        </div>

        <div
          className={`transition-all duration-700 ${
            step >= 0 ? "opacity-100" : "opacity-30"
          } flex flex-col items-center`}
        >
          <div className="rounded-full bg-indigo-600 text-white w-12 h-12 flex items-center justify-center font-bold shadow">
            A
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 mt-2">
            192.168.10.1 / 10.0.0.1
          </span>
        </div>

        <div
          className={`transition-all duration-700 ${
            step >= 1 ? "opacity-100" : "opacity-30"
          } flex flex-col items-center`}
        >
          <div className="rounded-full bg-green-600 text-white w-12 h-12 flex items-center justify-center font-bold shadow">
            B
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 mt-2">
            10.0.0.2 / 172.16.0.1
          </span>
        </div>

        <div
          className={`transition-all duration-700 ${
            step >= 2 ? "opacity-100" : "opacity-30"
          } flex flex-col items-center`}
        >
          <div className="rounded-full bg-yellow-600 text-white w-12 h-12 flex items-center justify-center font-bold shadow">
            C
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 mt-2">
            172.16.0.2 / 192.168.20.1
          </span>
        </div>

        <div className="text-center text-xs font-semibold text-gray-800 dark:text-gray-200">
          🖥️<br />
          Web Server<br />
          192.168.20.10
        </div>

        {/* Packet Animation */}
        <div
          className="absolute bg-indigo-500 rounded-full w-4 h-4 shadow-lg animate-bounce"
          style={{
            left: `${20 + step * 23}%`,
            top: "50%",
            transform: "translateY(-50%)",
            transition: "left 1.2s ease-in-out",
          }}
        ></div>
      </div>

      {/* Current Step Info */}
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-1">
          Step {step + 1} of {steps.length}
        </p>
        <p className="text-gray-700 dark:text-gray-200 text-sm">{currentStep.info}</p>
      </div>

      {/* Routing Table Display */}
      {activeRouter && (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
            📘 {activeRouter}'s Routing Table
          </h4>
          <table className="w-full text-sm text-gray-700 dark:text-gray-200 border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-2 text-left">Destination</th>
                <th className="border p-2 text-left">Next Hop</th>
                <th className="border p-2 text-left">Interface</th>
              </tr>
            </thead>
            <tbody>
              {routingTables[activeRouter].map((r, i) => (
                <tr
                  key={i}
                  className={`${
                    step === i + 1 ? "bg-indigo-100 dark:bg-indigo-900" : ""
                  } transition`}
                >
                  <td className="border p-2">{r.destination}</td>
                  <td className="border p-2">{r.nextHop}</td>
                  <td className="border p-2">{r.interface}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={handleStart}
          disabled={isRunning || step === steps.length - 1}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
        >
          ▶ Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md disabled:opacity-50"
        >
          ⏸ Pause
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          🔁 Reset
        </button>
      </div>
    </div>
  );
}
