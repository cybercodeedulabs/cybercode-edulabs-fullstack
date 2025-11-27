// src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import courseData from "../data/courseData";
import { useUser } from "../contexts/UserContext";

const AIAssistant = ({ embedMode = "floating" /* "floating" or "embedded" or "career" */ }) => {
  const [isOpen, setIsOpen] = useState(embedMode === "embedded");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm Cybercode AI Advisor. Ask me about courses or your career roadmap!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { user, userGoals, personaScores, userStats } = useUser();

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Generate course context for AI
  const getCourseContext = () => {
    return courseData
      .map(
        (c) =>
          `• ${c.title} (${c.category}) — ${c.description}. Link: https://cybercodeedulabs-platform.netlify.app/courses/${c.slug}`
      )
      .join("\n");
  };

  const handleSend = async (overridePrompt) => {
    const promptText = overridePrompt !== undefined ? overridePrompt : input;
    if (!promptText || !promptText.trim()) return;

    const userMessage = { from: "user", text: promptText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          messages: messages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
          courseContext: getCourseContext(),
          userGoals,
          personaScores,
          userStats,
        }),
      });

      const data = await response.json();

      const aiText =
        data.choices?.[0]?.message?.content ||
        data.error ||
        "Sorry, I couldn't find an answer to that.";

      // convert URLs to clickable links
      const formatted = aiText.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noreferrer" class="text-blue-600 underline">$1</a>'
      );

      setMessages((prev) => [...prev, { from: "bot", text: formatted, html: true }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Unable to connect to Cybercode AI service.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // If embedded, always open and render without floating button
  const renderChatWindow = () => (
    <div className="w-full bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-3 font-semibold flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare />
          <span>Cybercode AI Advisor</span>
        </div>
        {embedMode === "floating" && (
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-2 text-sm"
        style={{ maxHeight: "360px", overflowY: "auto", scrollbarWidth: "thin" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${msg.from === "user" ? "bg-indigo-100 text-right ml-10" : "bg-gray-100 mr-10"}`}
            dangerouslySetInnerHTML={msg.html ? { __html: msg.text } : { __html: msg.text }}
          />
        ))}

        {loading && <div className="text-gray-400 text-xs">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t">
        <input
          className="flex-1 border rounded-lg px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={embedMode === "career" ? "Ask about your roadmap, timeline, projects..." : "Ask about a course..."}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={() => handleSend()} className="ml-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
          <Send size={16} />
        </button>
      </div>
    </div>
  );

  // Floating variant
  if (embedMode === "floating") {
    return (
      <>
        <motion.button
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <MessageSquare />}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-20 right-6 w-80 z-50"
            >
              {renderChatWindow()}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Embedded variant (inline)
  return <div className="w-full">{renderChatWindow()}</div>;
};

export default AIAssistant;
