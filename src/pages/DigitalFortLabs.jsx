/* -------------------------------------------------------
   DigitalFortLabs.jsx — IAM Protected Labs Area
--------------------------------------------------------*/
import React from "react";
import { useIAM } from "../contexts/IAMContext";
import { Link } from "react-router-dom";

export default function DigitalFortLabs() {
  const { iamUser, loading, hydrated } = useIAM();

  if (loading || !hydrated) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading labs…
      </div>
    );
  }

  if (!iamUser) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center text-white p-6">
        <h1 className="text-3xl font-bold mb-4">DigitalFort Labs</h1>
        <p className="max-w-xl text-gray-300 mb-8">
          You need to be logged in with your Cybercode Cloud IAM account to
          access the Cyber Defense Labs.
        </p>

        <Link
          to="/cloud/login"
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-black font-bold text-lg"
        >
          Login with C3 IAM
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-12 bg-black">
      <h1 className="text-4xl font-bold text-cyan-300 mb-6">
        Welcome to DigitalFort Labs
      </h1>

      <p className="max-w-3xl text-gray-300 mb-10">
        Your secure research environment is being prepared. In future updates,
        this will include:
        <br />• AI-driven threat workbenches  
        • Private cyber ranges  
        • Attack-defense training modules  
        • Autonomous SOC assistant
      </p>

      <div className="p-6 rounded-lg bg-slate-900 border border-slate-700">
        <p>🚧 Coming Soon: Real cyber lab infrastructure integration.</p>
      </div>
    </div>
  );
}
