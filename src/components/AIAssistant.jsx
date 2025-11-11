// src/components/AIAssistant.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import courseData from "../data/courseData"; // ✅ Import your existing JS file

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm Cybercode AI Advisor. Ask me about our training courses!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Generate contextual knowledge from your courseData.js
  const getCourseContext = () => {
    return courseData
      .map(
        (course) =>
          `Course: ${course.title}\nCategory: ${course.category || "N/A"}\nDescription: ${course.description || "No description"}`
      )
      .join("\n\n");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a course advisor for Cybercode EduLabs. Use this course data to answer clearly:
              ${getCourseContext()}
              Only talk about Cybercode EduLabs courses. Be concise and friendly.`,
            },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      const aiReply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn’t find info about that.";
      setMessages((prev) => [...prev, { from: "bot", text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error: Unable to connect to AI service." },
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
                >
                  {msg.text}
                </div>
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
