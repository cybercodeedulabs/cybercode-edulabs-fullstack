// src/components/VoiceWelcome.jsx
import React from "react";
import { useEffect } from "react";

const VoiceWelcome = () => {
  useEffect(() => {
    const handleVoiceWelcome = () => {
      const message = new SpeechSynthesisUtterance(
        "Welcome to Cybercode EduLabs. Learn. Build. Excel."
      );
      message.lang = "en-US";
      message.pitch = 1.1;
      message.rate = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        v.name.includes("Google") || v.name.includes("Microsoft")
      );
      if (preferred) message.voice = preferred;

      if (!window.speechSynthesis.speaking) {
        window.speechSynthesis.speak(message);
      }

      window.removeEventListener("click", handleVoiceWelcome);
    };

    window.addEventListener("click", handleVoiceWelcome);
    return () => window.removeEventListener("click", handleVoiceWelcome);
  }, []);

  return null;
};

export default VoiceWelcome;
