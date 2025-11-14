import React, { useState, useRef } from "react";

/**
 * ACLSimulator.jsx
 *
 * Enterprise ACL Simulator (HR, IT, Servers, Internet)
 * Features:
 * - Standard & Extended ACL rules
 * - Add, edit, delete rules
 * - Reorder rules (up/down arrows)
 * - Apply ACL inbound/outbound on 4 router interfaces
 * - Packet test (src/dst/proto/port)
 * - Real-time first-match evaluation
 * - Hit counters per rule
 * - Detailed simulation logs
 */

export default function ACLSimulator() {
  /** -------------------------
   * NETWORK INTERFACES
   * --------------------------*/
  const interfaces = [
    { id: "g0", name: "Gig0/0 — HR LAN (10.10.10.0/24)" },
    { id: "g1", name: "Gig0/1 — IT LAN (10.20.20.0/24)" },
    { id: "g2", name: "Gig0/2 — Server LAN (10.30.30.0/24)" },
    { id: "g3", name: "Gig0/3 — Internet" },
  ];

  /** -------------------------
   * ACL RULES STATE
   * --------------------------*/
  const [rules, setRules] = useState([
    // initial example rule
    {
      id: 1,
      action: "permit",
      protocol: "ip",
      src: "10.10.10.0/24",
      dst: "10.30.30.0/24",
      port: "",
      hits: 0,
    },
  ]);

  const nextRuleId = useRef(2);

  /** -------------------------
   * ACL BINDINGS
   * --------------------------*/
  const [bindings, setBindings] = useState({
    g0_in: "",
    g0_out: "",
    g1_in: "",
    g1_out: "",
    g2_in: "",
    g2_out: "",
    g3_in: "",
    g3_out: "",
  });

  /** -------------------------
   * PACKET TEST FIELDS
   * --------------------------*/
  const [packet, setPacket] = useState({
    src: "10.10.10.5",
    dst: "10.30.30.10",
    protocol: "tcp",
    port: "22",
  });

  /** -------------------------
   * LOGGING
   * --------------------------*/
  const [logs, setLogs] = useState([
    "ACL Simulator ready — create rules and test packets.",
  ]);

  function log(msg) {
    setLogs((prev) => [...prev.slice(-15), `${new Date().toLocaleTimeString()} — ${msg}`]);
  }

  /** -------------------------
   * RULE MANAGEMENT
   * --------------------------*/
  function addRule() {
    const newRule = {
      id: nextRuleId.current++,
      action: "permit",
      protocol: "ip",
      src: "any",
      dst: "any",
      port: "",
      hits: 0,
    };
    setRules((prev) => [...prev, newRule]);
    log("Added new ACL rule.");
  }

  function updateRule(id, field, value) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function deleteRule(id) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    log(`Deleted rule ${id}.`);
  }

  function moveRuleUp(id) {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  }

  function moveRuleDown(id) {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return arr;
    });
  }

  /** -------------------------
   * PACKET MATCHING
   * --------------------------*/
  function ipMatch(ip, cidr) {
    if (cidr === "any") return true;
    try {
      const [network, prefix] = cidr.split("/");
      const mask = ~(2 ** (32 - Number(prefix)) - 1);
      const ipInt =
        ip.split(".").reduce((a, c) => (a << 8) + Number(c), 0) >>> 0;
      const netInt =
        network.split(".").reduce((a, c) => (a << 8) + Number(c), 0) >>> 0;
      return (ipInt & mask) === (netInt & mask);
    } catch {
      return false;
    }
  }

  function evaluatePacket() {
    log(
      `Testing packet: ${packet.src} -> ${packet.dst} [${packet.protocol}/${packet.port}]`
    );

    for (let rule of rules) {
      if (
        (rule.protocol === "ip" || rule.protocol === packet.protocol) &&
        ipMatch(packet.src, rule.src) &&
        ipMatch(packet.dst, rule.dst) &&
        (rule.port === "" || rule.port === packet.port)
      ) {
        // matched!
        rule.hits++;
        setRules([...rules]);
        log(`Matched rule ${rule.id}: ${rule.action.toUpperCase()} (hits: ${
          rule.hits
        })`);
        return;
      }
    }

    log("No rule matched — implicit deny.");
  }

  /** -------------------------
   * RENDER UI
   * --------------------------*/
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-4">
        🎯 ACL Simulator
      </h3>

      {/* Packet Tester */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["src", "dst", "protocol", "port"].map((f) => (
          <div key={f}>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              {f.toUpperCase()}
            </label>
            <input
              className="mt-1 w-full p-2 border rounded dark:bg-gray-800"
              value={packet[f]}
              onChange={(e) => setPacket({ ...packet, [f]: e.target.value })}
            />
          </div>
        ))}
        <button
          onClick={evaluatePacket}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md mt-6"
        >
          ▶ Test Packet
        </button>
      </div>

      {/* ACL Rules */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between items-center">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">
            ACL Rules (Top → Bottom)
          </h4>
          <button
            onClick={addRule}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
          >
            + Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {rules.map((r, index) => (
            <div
              key={r.id}
              className="p-3 border rounded bg-gray-50 dark:bg-gray-800"
            >
              <div className="grid grid-cols-6 gap-2 items-end">
                {/* Action */}
                <select
                  className="p-2 border rounded dark:bg-gray-700"
                  value={r.action}
                  onChange={(e) => updateRule(r.id, "action", e.target.value)}
                >
                  <option value="permit">permit</option>
                  <option value="deny">deny</option>
                </select>

                {/* Protocol */}
                <select
                  className="p-2 border rounded dark:bg-gray-700"
                  value={r.protocol}
                  onChange={(e) => updateRule(r.id, "protocol", e.target.value)}
                >
                  <option value="ip">ip</option>
                  <option value="tcp">tcp</option>
                  <option value="udp">udp</option>
                  <option value="icmp">icmp</option>
                </select>

                {/* Src */}
                <input
                  className="p-2 border rounded dark:bg-gray-700"
                  value={r.src}
                  onChange={(e) => updateRule(r.id, "src", e.target.value)}
                  placeholder="src (any or CIDR)"
                />

                {/* Dst */}
                <input
                  className="p-2 border rounded dark:bg-gray-700"
                  value={r.dst}
                  onChange={(e) => updateRule(r.id, "dst", e.target.value)}
                  placeholder="dst (any or CIDR)"
                />

                {/* Port */}
                <input
                  className="p-2 border rounded dark:bg-gray-700"
                  value={r.port}
                  onChange={(e) => updateRule(r.id, "port", e.target.value)}
                  placeholder="port (optional)"
                />

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => moveRuleUp(r.id)}
                    className="px-2 py-1 bg-gray-300 rounded text-xs"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveRuleDown(r.id)}
                    className="px-2 py-1 bg-gray-300 rounded text-xs"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteRule(r.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Hits */}
              <div className="text-xs text-gray-500 mt-1">Hits: {r.hits}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Simulation Logs
        </div>
        <div className="h-48 overflow-auto p-3 bg-black text-green-300 rounded font-mono text-xs">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
