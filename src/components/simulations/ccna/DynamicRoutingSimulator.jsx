import React, { useState, useEffect } from "react";

export default function DynamicRoutingSimulator() {
  const [protocol, setProtocol] = useState("RIP");
  const [routes, setRoutes] = useState([]);
  const [log, setLog] = useState([]);

  const networks = ["192.168.1.0/24", "192.168.2.0/24", "192.168.3.0/24"];

  useEffect(() => {
    setLog([]);
    setRoutes([]);
  }, [protocol]);

  const startSimulation = () => {
    setLog([]);
    setRoutes([]);
    const steps = [
      "Initializing routing process...",
      `Starting ${protocol} discovery...`,
      "Exchanging routing information between routers...",
      "Building routing tables...",
      "Verifying reachability...",
      "Routing convergence complete ✅"
    ];

    steps.forEach((msg, i) => {
      setTimeout(() => setLog((prev) => [...prev, msg]), i * 1000);
    });

    setTimeout(() => {
      if (protocol === "RIP") {
        setRoutes(networks.map((n, i) => ({
          network: n,
          metric: i + 1,
          nextHop: `10.0.0.${i + 1}`
        })));
      } else {
        setRoutes(networks.map((n, i) => ({
          network: n,
          cost: (i + 1) * 10,
          area: 0
        })));
      }
    }, 4000);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        ⚙️ Dynamic Routing Protocol Visualizer
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Simulate how RIP and OSPF routers exchange routes and reach convergence.
      </p>

      <div className="flex gap-4 mb-4">
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="RIP">RIP (Distance Vector)</option>
          <option value="OSPF">OSPF (Link State)</option>
        </select>
        <button
          onClick={startSimulation}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ▶ Start Simulation
        </button>
      </div>

      <div className="bg-black text-green-300 font-mono text-sm p-3 rounded mb-3 h-40 overflow-auto">
        {log.length ? log.join("\n") : "Ready to simulate..."}
      </div>

      {routes.length > 0 && (
        <table className="w-full text-sm border dark:border-gray-700">
          <thead className="bg-indigo-100 dark:bg-indigo-800">
            <tr>
              <th className="px-2 py-1">Network</th>
              {protocol === "RIP" ? (
                <>
                  <th className="px-2 py-1">Metric (Hops)</th>
                  <th className="px-2 py-1">Next Hop</th>
                </>
              ) : (
                <>
                  <th className="px-2 py-1">Cost</th>
                  <th className="px-2 py-1">Area</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                <td className="px-2 py-1">{r.network}</td>
                {protocol === "RIP" ? (
                  <>
                    <td className="px-2 py-1">{r.metric}</td>
                    <td className="px-2 py-1">{r.nextHop}</td>
                  </>
                ) : (
                  <>
                    <td className="px-2 py-1">{r.cost}</td>
                    <td className="px-2 py-1">{r.area}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
