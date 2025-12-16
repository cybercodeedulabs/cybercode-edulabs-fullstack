/* -------------------------------------------------------
   AgenticAnimation.jsx
   Hollywood-Style Cyber Attack → Defense → Neutralization
--------------------------------------------------------*/
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgenticAnimation({ autoRun = true }) {
  const [stage, setStage] = useState("idle"); 
  const timeoutRefs = useRef([]);

  const runSequence = () => {
    setStage("attack");

    timeoutRefs.current.push(
      setTimeout(() => setStage("ai-detect"), 1800)
    );
    timeoutRefs.current.push(
      setTimeout(() => setStage("shield"), 3600)
    );
    timeoutRefs.current.push(
      setTimeout(() => setStage("counter"), 5200)
    );
    timeoutRefs.current.push(
      setTimeout(() => setStage("neutralized"), 7000)
    );
  };

  useEffect(() => {
    if (autoRun) {
      setTimeout(runSequence, 800);
    }
    return () => timeoutRefs.current.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden border border-cyan-700/30 shadow-xl">

      {/* WORLD MAP BACKDROP */}
      <img
        src="/images/worldmap-grid.png"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* INDIA TARGET GLOW */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage !== "idle" ? 1 : 0 }}
        style={{
          left: "58%",
          top: "48%",
          width: "40px",
          height: "40px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400 blur-xl opacity-70 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-cyan-300"></div>
      </motion.div>

      {/* ATTACK PACKETS */}
      <AnimatePresence>
        {stage === "attack" && (
          <>
            {[1, 2, 3].map((id) => (
              <motion.div
                key={id}
                className="absolute w-2 h-2 bg-red-500 rounded-full shadow-lg"
                initial={{
                  x: -100,
                  y: 100 * id,
                  opacity: 0,
                }}
                animate={{
                  x: "58vw",
                  y: "48vh",
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* AI DETECTION LABEL */}
      {stage === "ai-detect" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 text-cyan-300 text-xl font-bold"
        >
          ⚡ AI Detecting Threat…
        </motion.div>
      )}

      {/* SHIELD DEPLOY */}
      {stage === "shield" && (
        <motion.div
          className="absolute rounded-full border-4 border-cyan-400 shadow-cyan-300"
          initial={{
            width: 0,
            height: 0,
            left: "58%",
            top: "48%",
            opacity: 0,
          }}
          animate={{
            width: 180,
            height: 180,
            left: "58%",
            top: "48%",
            opacity: 1,
          }}
          transition={{ duration: 1 }}
          style={{ transform: "translate(-50%, -50%)" }}
        />
      )}

      {/* COUNTER RESPONSE */}
      {stage === "counter" && (
        <motion.div
          className="absolute w-2 h-2 bg-cyan-300 rounded-full shadow shadow-cyan-600"
          initial={{ x: "58vw", y: "48vh" }}
          animate={{ x: "20vw", y: "30vh" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      )}

      {/* NEUTRALIZED */}
      {stage === "neutralized" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-green-400 text-2xl font-bold"
        >
          ✅ Threat Neutralized
        </motion.div>
      )}

      {/* PLAY BUTTON */}
      <button
        onClick={runSequence}
        className="absolute bottom-4 right-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-black font-bold"
      >
        ▶ Play Again
      </button>
    </div>
  );
}
