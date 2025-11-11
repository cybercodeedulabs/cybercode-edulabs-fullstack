// src/components/AIAssistant.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import courseData from "../data/courseData";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm Cybercode AI Advisor. Ask me about our training courses!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Format your course data for context
  const getCourseContext = () => {
    return courseData
      .map(
        (c) =>
          `• ${c.title} (${c.category}) — ${c.description}. Link: https://cybercodeedulabs.netlify.app/courses/${c.slug}`
      )
      .join("\n");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Send to your Netlify function (not OpenAI directly)
      const response = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          messages: messages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
          courseContext: getCourseContext(),
        }),
      });

      const data = await response.json();

      const aiText =
        data.choices?.[0]?.message?.content ||
        data.error ||
        "Sorry, I couldn't find info about that course.";

      // ✅ Auto-convert URLs into clickable links
      const formatted = aiText.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-blue-600 underline">$1</a>'
      );

      setMessages((prev) => [...prev, { from: "bot", text: formatted, html: true }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Unable to connect to Cybercode AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 w-80 bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="bg-blue-600 text-white p-3 font-semibold">
              Cybercode AI Advisor
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    msg.from === "user"
                      ? "bg-blue-100 text-right ml-10"
                      : "bg-gray-100 mr-10"
                  }`}
                  dangerouslySetInnerHTML={
                    msg.html ? { __html: msg.text } : { __html: msg.text }
                  }
                ></div>
              ))}
              {loading && <div className="text-gray-400 text-xs">Thinking...</div>}
            </div>

            <div className="flex items-center p-2 border-t">
              <input
                className="flex-1 border rounded-lg px-2 py-1 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a course..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
