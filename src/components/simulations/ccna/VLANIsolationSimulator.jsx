import React, { useState } from "react";

export default function VLANIsolationSimulator() {
  const [vlanAActive, setVlanAActive] = useState(false);
  const [vlanBActive, setVlanBActive] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendPacket = (source, vlan) => {
    const destVlan = vlan === "A" ? vlanAActive : vlanBActive;
    const otherVlan = vlan === "A" ? vlanBActive : vlanAActive;
    const newMsg = [`📡 ${source} in VLAN-${vlan} sends a frame...`];

    if (destVlan) {
      newMsg.push(`✅ Frame delivered within VLAN-${vlan}.`);
    }
    if (otherVlan) {
      newMsg.push(`❌ Frame blocked — VLANs are isolated.`);
    }

    setMessages((prev) => [...newMsg, "--------------------------------"]);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-3">
        🧠 VLAN Isolation Simulator
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Toggle VLANs and simulate packet delivery to see how VLAN isolation works.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-800 rounded-lg text-center">
          <h4 className="font-semibold mb-2">VLAN 10 (HR)</h4>
          <button
            onClick={() => setVlanAActive(!vlanAActive)}
            className={`px-4 py-2 rounded ${
              vlanAActive ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            {vlanAActive ? "Connected" : "Disconnected"}
          </button>
          <button
            onClick={() => sendPacket("HR-PC", "A")}
            disabled={!vlanAActive}
            className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Send Packet
          </button>
        </div>

        <div className="p-3 bg-pink-50 dark:bg-pink-800 rounded-lg text-center">
          <h4 className="font-semibold mb-2">VLAN 20 (IT)</h4>
          <button
            onClick={() => setVlanBActive(!vlanBActive)}
            className={`px-4 py-2 rounded ${
              vlanBActive ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
          >
            {vlanBActive ? "Connected" : "Disconnected"}
          </button>
          <button
            onClick={() => sendPacket("IT-PC", "B")}
            disabled={!vlanBActive}
            className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Send Packet
          </button>
        </div>
      </div>

      <div className="p-3 bg-black text-green-300 font-mono rounded h-40 overflow-auto">
        {messages.length > 0 ? (
          messages.map((msg, i) => <div key={i}>{msg}</div>)
        ) : (
          <div>💡 Toggle VLANs and send packets to observe behavior.</div>
        )}
      </div>
    </div>
  );
}
