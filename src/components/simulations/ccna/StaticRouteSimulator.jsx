import React, { useState } from "react";

export default function StaticRouteSimulator() {
  const [table, setTable] = useState([
    { network: "192.168.1.0/24", nextHop: "Directly Connected", interface: "G0/0" },
    { network: "10.0.0.0/30", nextHop: "Directly Connected", interface: "G0/1" },
  ]);
  const [newRoute, setNewRoute] = useState({ network: "", mask: "", nextHop: "" });
  const [testIp, setTestIp] = useState("");
  const [result, setResult] = useState("");

  const addRoute = () => {
    if (!newRoute.network || !newRoute.mask || !newRoute.nextHop) return;
    setTable([...table, {
      network: `${newRoute.network}/${newRoute.mask}`,
      nextHop: newRoute.nextHop,
      interface: "G0/1"
    }]);
    setNewRoute({ network: "", mask: "", nextHop: "" });
  };

  const testRouting = () => {
    if (!testIp) return setResult("Enter an IP to test.");
    const match = table.find(r => testIp.startsWith(r.network.split(".")[0]));
    if (match) {
      setResult(`✅ Packet to ${testIp} forwarded via ${match.nextHop} (${match.interface})`);
    } else {
      setResult(`🚫 No route found. Using default route or dropped.`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-3">
        🛰️ Static Route Simulator
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Add static routes to the routing table and test how packets are forwarded.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          placeholder="Network (e.g., 192.168.2.0)"
          value={newRoute.network}
          onChange={e => setNewRoute({ ...newRoute, network: e.target.value })}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Mask bits (e.g., 24)"
          value={newRoute.mask}
          onChange={e => setNewRoute({ ...newRoute, mask: e.target.value })}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Next Hop IP"
          value={newRoute.nextHop}
          onChange={e => setNewRoute({ ...newRoute, nextHop: e.target.value })}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <button onClick={addRoute} className="px-4 py-2 bg-indigo-600 text-white rounded mb-4">
        ➕ Add Route
      </button>

      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Routing Table:</h4>
        <table className="w-full text-sm border dark:border-gray-700">
          <thead className="bg-indigo-100 dark:bg-indigo-800">
            <tr>
              <th className="px-2 py-1">Network</th>
              <th className="px-2 py-1">Next Hop</th>
              <th className="px-2 py-1">Interface</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                <td className="px-2 py-1">{r.network}</td>
                <td className="px-2 py-1">{r.nextHop}</td>
                <td className="px-2 py-1">{r.interface}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 items-center mb-3">
        <input
          type="text"
          placeholder="Test destination IP"
          value={testIp}
          onChange={e => setTestIp(e.target.value)}
          className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
        />
        <button onClick={testRouting} className="px-4 py-2 bg-green-600 text-white rounded">
          Test Route
        </button>
      </div>

      <pre className="bg-black text-green-300 p-3 rounded font-mono text-sm h-28 overflow-auto">
        {result || "💡 Add routes and test packet forwarding."}
      </pre>
    </div>
  );
}
