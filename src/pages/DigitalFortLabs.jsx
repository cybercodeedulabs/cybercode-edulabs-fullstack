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
            <h1 className="text-4xl font-bold text-cyan-300 mb-3">
                DigitalFort Labs
            </h1>

            <p className="max-w-3xl text-gray-300 mb-6">
                DigitalFort Labs is Cybercode’s secure cyber-defense simulation space.
                This environment allows students, engineers, and security teams to
                observe, analyze, and practice defense strategies against real-world
                cyberattack scenarios — safely and interactively.
            </p>

            {/* PHASE INFO */}
            <div className="mb-10 max-w-4xl p-4 rounded-xl border border-cyan-700/40 bg-cyan-900/10">
                <p className="text-sm text-cyan-200 leading-relaxed">
                    <span className="font-semibold text-cyan-300">Phase-A Labs:</span>{" "}
                    These labs focus on <b>visualization, understanding attack flows,
                    and defensive reasoning</b>. Hands-on cyber ranges, virtual machines,
                    and autonomous defense systems will unlock in upcoming phases.
                </p>
            </div>

            {/* LABS GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">

                {/* Lab 1 */}
                <Link to="/digital-fort/labs/global-threat-simulator">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl hover:scale-[1.03] transition transform cursor-pointer">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                            🌍 Global Threat Simulator
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Observe live simulated cyberattacks across the globe and
                            understand how threats originate, spread, and impact regions.
                        </p>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-600 text-black font-semibold">
                            LIVE
                        </span>
                    </div>
                </Link>

                {/* Lab 2 */}
                <Link to="/digital-fort/labs/attack-replay">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl hover:scale-[1.03] transition transform cursor-pointer">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                            🔁 Attack Replay Lab
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            Step through a complete cyberattack lifecycle to understand
                            attacker behavior, detection timing, and defensive response.
                        </p>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-yellow-500 text-black font-semibold">
                            DEMO
                        </span>
                    </div>
                </Link>

                {/* Lab 3 */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-70">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                        🛡 Endpoint Defense Simulator
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Simulated endpoint attacks and detections at system level.
                        Requires virtualized lab infrastructure.
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-600 text-white font-semibold">
                        LOCKED
                    </span>
                </div>

                {/* Lab 4 */}
                {role === "admin" && (
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-70">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                            🤖 AI SOC Assistant
                        </h2>
                        <p className="text-gray-300 text-sm mb-4">
                            AI-assisted SOC analysis, alert correlation, and response
                            guidance for advanced users.
                        </p>
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-purple-500 text-black font-semibold">
                            ADMIN
                        </span>
                    </div>
                )}

                {/* Lab 5 */}
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-700 shadow-xl opacity-70">
                    <h2 className="text-xl font-semibold text-cyan-300 mb-2">
                        🧪 Cyber Range (Private)
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        Isolated cyber ranges with real attack-defense execution.
                        Available in Phase-B with VM-backed environments.
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-slate-600 text-white font-semibold">
                        LOCKED
                    </span>
                </div>

            </div>

            {/* FOOTER NOTE */}
            <div className="mt-14 max-w-3xl text-gray-400 text-sm">
                DigitalFort Labs will continuously evolve from visualization to
                full-scale cyber ranges, AI-driven defense engines, and private
                cloud-backed security research environments.
            </div>
        </div>
    );
}
