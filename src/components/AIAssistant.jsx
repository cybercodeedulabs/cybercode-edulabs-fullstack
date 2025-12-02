// src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import courseData from "../data/courseData";
import { useUser } from "../contexts/UserContext";
import { canSendNow } from "../utils/aiClientThrottle";

const AVATAR_BOT = "/images/logo-placeholder.png";
const MAX_COURSE_CONTEXT_CHARS = 20000;

const AIAssistant = ({ embedMode = "floating" }) => {
  const { user, userGoals, personaScores, userStats } = useUser();

  const [isOpen, setIsOpen] = useState(embedMode === "embedded");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm Cybercode AI Advisor. Ask me about courses or your career roadmap!",
      id: `m-init-1`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [systemNotice, setSystemNotice] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isOpen]);

  const getCourseContext = () =>
    courseData
      .map(
        (c) =>
          `• ${c.title} (${c.category}) — ${c.description}. Link: https://cybercodeedulabs-platform.netlify.app/courses/${c.slug}`
      )
      .join("\n");

  const renderMarkdown = (text) => {
    try {
      marked.setOptions({ breaks: true, gfm: true });
      return DOMPurify.sanitize(marked.parse(text || ""));
    } catch {
      return DOMPurify.sanitize(text || "");
    }
  };

  const buildConversation = (additionalUserMessage) => {
    const convo = messages.slice(-6).map((m) => ({
      role: m.role || (m.from === "user" ? "user" : "assistant"),
      content: m.content || m.text || "",
    }));
    convo.push({ role: "user", content: additionalUserMessage });
    return convo;
  };

  const handleSend = async (overridePrompt) => {
    if (!canSendNow()) {
      setSystemNotice("Please wait a second before sending another message.");
      setTimeout(() => setSystemNotice(null), 1600);
      return;
    }

    const promptText = overridePrompt !== undefined ? overridePrompt : input;
    if (!promptText || !promptText.trim()) return;

    const userMsg = { role: "user", content: promptText, id: `u-${Date.now()}` };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);
    setIsTyping(true);
    setSystemNotice(null);

    const messagesForApi = buildConversation(promptText);
    const courseContext = (getCourseContext() || "").substring(0, MAX_COURSE_CONTEXT_CHARS);

    try {
      const res = await fetch("/.netlify/functions/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          messages: messagesForApi,
          courseContext,
          userGoals,
          personaScores,
          userStats,
          mode: "chat",
          user: user ? { uid: user.uid } : null,
        }),
      });

      const data = await res.json();

      if (res.status === 429 || data?.error?.toLowerCase?.().includes("rate")) {
        setSystemNotice("Server is busy or rate-limited. Please try in a moment.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data?.choices?.[0]?.message?.content ||
              data?.raw?.cached
                ? "Showing cached answer (offline mode)."
                : "⚠️ The AI is busy. Try again shortly.",
            id: `a-err-${Date.now()}`,
          },
        ]);
      } else {
        const aiText =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.text ||
          data?.error ||
          "Sorry, I couldn't find an answer to that.";

        const cleaned = aiText.replace(/\n{3,}/g, "\n\n").trim();

        setMessages((prev) => [...prev, { role: "assistant", content: cleaned, id: `a-${Date.now()}` }]);
      }
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Unable to connect to Cybercode AI service.", id: `a-err-${Date.now()}` },
      ]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
      setTimeout(() => {}, 300);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  const quickPrompts = [
    "Show me a 3-month roadmap to become a Cloud/DevOps engineer using Cybercode courses.",
    "Tell me about the Python Programming (Job-Focused) course — syllabus and duration.",
    "I want a free demo class — how to register?",
  ];

  const renderMessage = (m, i) => {
    const isUser = m.role === "user";
    const html = renderMarkdown(m.content);
    return (
      <div key={m.id || `${i}-${m.role}`} className={`chat-bubble ${isUser ? "chat-user" : "chat-bot"}`} role="article">
        {!isUser && (
          <div className="bot-meta">
            <img src={AVATAR_BOT} alt="Cybercode" className="bot-avatar" />
            <div className="bot-name">Cybercode AI Advisor</div>
          </div>
        )}

        <div className="chat-content prose" dangerouslySetInnerHTML={{ __html: html }} />

        {isUser && <div className="user-tag">You</div>}
      </div>
    );
  };

  const renderChatWindow = () => (
    <div className={`ai-assistant-root`} style={{ width: embedMode === "embedded" ? "100%" : undefined }}>
      <div className="ai-header flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Icon icon="mdi:message-text-outline" width={22} />
          <div>
            <div className="text-lg font-semibold">Cybercode AI Advisor</div>
            <div className="text-xs text-slate-400">Ask about courses, career roadmaps, and projects</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTyping && (
            <div className="typing-indicator" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          )}
          {embedMode === "floating" ? (
            <button onClick={() => setIsOpen(false)} className="icon-btn" aria-label="Close chat">
              <Icon icon="mdi:close" width={20} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="ai-messages flex-1 p-4" style={{ maxHeight: 360 }}>
        <div className="space-y-3">
          {messages.map((m, i) => renderMessage(m, i))}
          {isTyping && (
            <div className="chat-bubble chat-bot typing-bubble">
              <div className="chat-content">
                <div className="typing-indicator-inline">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 pt-2 pb-0">
        <div className="quick-cta flex gap-2 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button key={idx} onClick={() => handleSend(q)} className="quick-chip">
              {q.length > 40 ? q.slice(0, 40) + "…" : q}
            </button>
          ))}
        </div>
      </div>

      <div className="ai-input px-3 py-3 border-t">
        <textarea
          className="input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a course or request a roadmap... (Shift+Enter for new line)"
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <div className="input-actions">
          <button
            className="send-btn"
            aria-label="Send message"
            onClick={() => !isSending && handleSend()}
            disabled={isSending}
            title="Send"
          >
            <Icon icon="mdi:send" width={20} />
          </button>
        </div>
      </div>

      {systemNotice && (
        <div className="p-2 text-sm text-yellow-700 bg-yellow-50 rounded mt-2 mx-3">{systemNotice}</div>
      )}
    </div>
  );

  if (embedMode === "floating") {
    return (
      <>
        <motion.button
          className="floating-toggle"
          onClick={() => setIsOpen((s) => !s)}
          initial={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open Cybercode AI Advisor"
        >
          {isOpen ? (
            <Icon icon="mdi:close" width={22} />
          ) : (
            <Icon icon="mdi:message-text-outline" width={22} />
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="fixed bottom-24 right-6 z-[9999] w-96 max-w-[calc(100vw-2rem)]"
            >
              <div className="rounded-2xl shadow-2xl overflow-hidden">{renderChatWindow()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return <div className="w-full">{renderChatWindow()}</div>;
};

export default AIAssistant;
