// src/components/simulations/LinuxPermissionSimulator.jsx
import React, { useState } from "react";

/**
 * LinuxPermissionSimulator
 * Toggle rwx bits visually and show resulting effective permissions for user/group/other.
 */
export default function LinuxPermissionSimulator() {
  const [perm, setPerm] = useState({ user: { r: true, w: true, x: false }, group: { r: true, w: false, x: false }, other: { r: false, w: false, x: false } });

  const toggle = (who, bit) => {
    setPerm((p) => ({ ...p, [who]: { ...p[who], [bit]: !p[who][bit] } }));
  };

  const toOctal = (bits) => ((bits.r ? 4 : 0) + (bits.w ? 2 : 0) + (bits.x ? 1 : 0)).toString();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-indigo-700">🛡️ Linux Permission Simulator</h3>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        {["user", "group", "other"].map((who) => (
          <div key={who} className="p-3 border rounded">
            <div className="font-semibold mb-2">{who.toUpperCase()}</div>
            <div className="flex justify-center gap-2">
              {["r", "w", "x"].map((b) => (
                <button
                  key={b}
                  onClick={() => toggle(who, b)}
                  className={`px-3 py-1 rounded-md text-sm ${perm[who][b] ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm">Octal: <span className="font-mono">{toOctal(perm[who])}</span></div>
          </div>
        ))}
      </div>

      <div className="text-sm">
        Combined mode (rwx): <span className="font-mono">{`${toOctal(perm.user)}${toOctal(perm.group)}${toOctal(perm.other)}`}</span>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Click bits to toggle and observe the octal representation. Useful for teaching file permission basics.
      </div>
    </div>
  );
}
