// src/components/CloudWaitlist.jsx
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CloudWaitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Email is required." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await addDoc(collection(db, "cloud_waitlist"), {
        name: name || null,
        email,
        organization: org || null,
        interest: interest || null,
        timestamp: serverTimestamp(),
      });
      setMessage({ type: "success", text: "You are on the Cybercode Cloud waitlist. Thank you!" });
      setName(""); setEmail(""); setOrg(""); setInterest("");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Submit failed. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 p-6 rounded-lg shadow bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Join Cybercode Cloud Beta</h3>
      <p className="text-sm text-gray-500 mb-4">Get early access and credits for selected users.</p>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 rounded border bg-transparent" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full p-2 rounded border bg-transparent" />
        <input value={org} onChange={(e)=>setOrg(e.target.value)} placeholder="Organization / Role" className="w-full p-2 rounded border bg-transparent" />
        <select value={interest} onChange={(e)=>setInterest(e.target.value)} className="w-full p-2 rounded border bg-transparent">
          <option value="">Why are you interested?</option>
          <option value="developer">Developer</option>
          <option value="startup">Startup</option>
          <option value="student">Student</option>
          <option value="institution">Institution</option>
        </select>
        <button type="submit" disabled={loading} className="w-full py-2 rounded bg-indigo-600 text-white">
          {loading ? "Joining..." : "Join Waitlist"}
        </button>
        {message && <div className={"text-sm mt-2 " + (message.type==="success" ? "text-green-600" : "text-red-500")}>{message.text}</div>}
      </form>
    </div>
  );
}
