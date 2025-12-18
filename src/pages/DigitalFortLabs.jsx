/* -------------------------------------------------------
   DigitalFortLabs.jsx — IAM Protected Labs Area
   Phase 1: Simulator Index (UI Only)
   IAM logic preserved exactly
--------------------------------------------------------*/
import React from "react";
import { useIAM } from "../contexts/IAMContext";
import { Link } from "react-router-dom";

export default function DigitalFortLabs() {
    const { iamUser, loading, hydrated } = useIAM();
    const role = iamUser?.role || "student";


    if (loading || !hydrated) {
        return (
            <div className="min-h-screen flex justify-center items-center text-white bg-black">
                Loading labs…
            </div>
        );
    }

    if (!iamUser) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center text-white p-6 bg-black">
                <h1 className="text-3xl font-bold mb-4 text-cyan-300">
                    DigitalFort Labs
                </h1>

                <p className="max-w-xl text-gray-300 mb-8">
                    DigitalFort Labs is a secure cyber-defense simulation environment.
                    You must be logged in with your Cybercode Cloud IAM account to access
                    protected labs and simulators.
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
        <div className="min-h-screen text-white p-10 bg-black">
            {/* HEADER */}
            <h1 className="text-4xl font-bold text-cyan-300 mb-4">
                DigitalFort Labs
            </h1>

            <p className="max-w-3xl text-gray-300 mb-10">
                DigitalFort Labs is Cybercode’s secure cyber-defense simulation space.
                This environment allows students, engineers, and security teams to
                observe, analyze, and practice defense strategies against real-world
                cyberattack scenarios — safely and interactively.
            </p>

            {/* LABS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">

                {/* Lab 1 */}
                <Link to="/digital-fort/labs/global-threat-simulator">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl hover:scale-[1.03] transition transform cursor-pointer">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                            🌍 Global Threat Simulator
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Visualize simulated cyberattacks across the globe. Observe how
                            threats originate, propagate, and impact different regions in
                            real time.
                        </p>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-600 text-black font-semibold">
                            Live
                        </span>
                    </div>
                </Link>

                {/* Lab 2 — NOW CLICKABLE */}
                <Link to="/digital-fort/labs/attack-replay">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl hover:scale-[1.03] transition transform cursor-pointer">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                            🔁 Attack Replay Lab
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Replay historical cyberattack scenarios step-by-step to understand
                            attacker behavior, detection timing, and response gaps.
                        </p>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-500 text-black font-semibold">
                            Demo
                        </span>
                    </div>
                </Link>


                {/* Lab 3 */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-80">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                        🛡 Endpoint Defense Simulator
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Practice detecting malware, lateral movement, and suspicious
                        behavior at endpoint level using simulated enterprise systems.
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-600 text-white font-semibold">
                        Coming Soon
                    </span>
                </div>

                {/* Lab 4 */}
                {role === "admin" && (
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-80">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                        🤖 AI SOC Assistant
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Interact with an AI-powered SOC assistant that helps analyze alerts,
                        correlate signals, and recommend defensive actions.
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-600 text-white font-semibold">
                        Coming Soon
                    </span>
                </div>
                )}

                {/* Lab 5 */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-80">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                        🧪 Cyber Range (Private)
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Isolated environments for practicing full attack-defense scenarios
                        without impacting real systems.
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-600 text-white font-semibold">
                        Coming Soon
                    </span>
                </div>

            </div>

            {/* FOOTER NOTE */}
            <div className="mt-14 max-w-3xl text-gray-400 text-sm">
                This labs environment will continuously evolve. Future updates will
                integrate AI-driven analysis, private cloud workspaces, and advanced
                cyber-defense tooling under the Cybercode DigitalFort initiative.
            </div>
        </div>
    );
}
