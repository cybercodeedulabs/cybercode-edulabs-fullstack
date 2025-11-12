// src/components/simulations/IAMSimulator.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * IAMSimulator.jsx
 * -------------------------------------------------------
 * Simulates Identity and Access Management (IAM) logic.
 * Users can toggle permissions and test access outcomes.
 * Helps visualize how IAM evaluates access requests.
 */

const IAMSimulator = () => {
  const [permissions, setPermissions] = useState({
    "s3:ListBucket": true,
    "s3:DeleteObject": false,
    "ec2:StartInstances": false,
    "ec2:DescribeInstances": true,
  });

  const [selectedAction, setSelectedAction] = useState("s3:ListBucket");
  const [result, setResult] = useState("");

  const togglePermission = (action) => {
    setPermissions((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };

  const handleSimulate = () => {
    const allowed = permissions[selectedAction];
    const msg = allowed
      ? `✅ Access GRANTED for action: ${selectedAction}`
      : `❌ Access DENIED for action: ${selectedAction}`;
    setResult(msg);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-center text-indigo-700 dark:text-indigo-300">
        🔐 IAM Access Control Simulator
      </h2>

      {/* Permissions Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-indigo-50 dark:bg-indigo-800 text-gray-700 dark:text-gray-200">
            <th className="border p-2">Action</th>
            <th className="border p-2">Resource</th>
            <th className="border p-2">Access</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(permissions).map((action) => (
            <tr key={action} className="text-center">
              <td className="border p-2 font-mono">{action}</td>
              <td className="border p-2">AWS Resource</td>
              <td className="border p-2">
                <button
                  onClick={() => togglePermission(action)}
                  className={`px-3 py-1 rounded-md text-sm font-semibold ${
                    permissions[action]
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {permissions[action] ? "ALLOW" : "DENY"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Selector */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <select
          className="border rounded-md p-2 text-gray-700 dark:text-gray-200 dark:bg-gray-800"
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          {Object.keys(permissions).map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        <button
          onClick={handleSimulate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Test Access
        </button>
      </div>

      {/* Animated Result */}
      <motion.div
        key={result}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`text-center font-semibold ${
          result.includes("GRANTED")
            ? "text-green-600"
            : result.includes("DENIED")
            ? "text-red-600"
            : "text-gray-700"
        }`}
      >
        {result || "Select an action and test IAM access."}
      </motion.div>

      {/* Legend */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center italic">
        Simulates IAM permission evaluation logic — not connected to AWS.
      </div>
    </div>
  );
};

export default IAMSimulator;
