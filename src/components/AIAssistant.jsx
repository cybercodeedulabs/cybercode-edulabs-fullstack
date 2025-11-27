// src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import courseData from "../data/courseData";
import { useUser } from "../contexts/UserContext";

// Cybercode Signature Theme colors (tailwind classes + plain CSS fallback)
const AVATAR_BOT = "/images/logo-placeholder.png"; // optional logo for bot
const MAX_COURSE_CONTEXT_CHARS = 20000;

const AIAssistant = ({ embedMode = "floating" }) => {
  const { user, userGoals, personaScores, userStats } = useUser();

  const [isOpen, setIsOpen] = useState(embedMode === "embedded");
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content: "👋 Hi! I'm Cybercode AI Advisor. Ask me about courses or your career roadmap!",
      id: `m-init-1`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // detect theme from html.dark (your App toggles this)
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  // Auto-scroll when messages change or typing changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping, isOpen]);

  // Build compact course context
  const getCourseContext = () => {
    return courseData
      .map(
        (c) =>
          `• ${c.title} (${c.category}) — ${c.description}. Link: https://cybercodeedulabs-platform.netlify.app/courses/${c.slug}`
      )
      .join("\n");
  };

  // Safe markdown -> html
  const renderMarkdown = (text) => {
    try {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      const raw = marked.parse(text || "");
      return DOMPurify.sanitize(raw);
    } catch (e) {
      return DOMPurify.sanitize(text);
    }
  };

  // Prepare conversation payload (convert to OpenAI-like messages)
  const buildConversation = (additionalUserMessage) => {
    // include last N messages to preserve context (but not entire app state)
    // We'll include all messages for now (small chat), convert roles to 'user'|'assistant'
    const convo = messages.map((m) => ({
      role: m.role || (m.from === "user" ? "user" : "assistant"),
      content: m.content || m.text || "",
    }));

    // Append the new user message (the one we're sending now)
    convo.push({ role: "user", content: additionalUserMessage });

    return convo;
  };

  // Send message to backend
  const handleSend = async (overridePrompt) => {
    const promptText = overridePrompt !== undefined ? overridePrompt : input;
    if (!promptText || !promptText.trim()) return;

    // Add user message locally immediately
    const userMsg = {
      role: "user",
      content: promptText,
      id: `u-${Date.now()}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);
    setIsTyping(true);

    // Build payload with a snapshot of messages + this user message
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
        }),
      });

      const data = await res.json();

      const aiText =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.text ||
        data?.error ||
        "Sorry, I couldn't find an answer to that.";

      // small cleanup of extra newlines
      const cleaned = aiText.replace(/\n{3,}/g, "\n\n").trim();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleaned, id: `a-${Date.now()}` },
      ]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to connect to Cybercode AI service. Please try again later.",
          id: `a-err-${Date.now()}`,
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  // Quick helpers: prefilled prompts for CTA buttons
  const quickPrompts = [
    "Show me a 3-month roadmap to become a Cloud/DevOps engineer using Cybercode courses.",
    "Tell me about the Python Programming (Job-Focused) course — syllabus and duration.",
    "I want a free demo class — how to register?",
  ];

  // Render each message bubble
  const renderMessage = (m, i) => {
    const isUser = m.role === "user";
    const html = renderMarkdown(m.content);

    return (
      <div
        key={m.id || `${i}-${m.role}`}
        className={`chat-bubble ${isUser ? "chat-user" : "chat-bot"}`}
        // accessibility
        role="article"
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        {!isUser && (
          <div className="bot-meta">
            <img src={AVATAR_BOT} alt="Cybercode" className="bot-avatar" />
            <div className="bot-name">Cybercode AI Advisor</div>
          </div>
        )}

        <div
          className="chat-content prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {isUser && <div className="user-tag">You</div>}
      </div>
    );
  };

  // Floating UI
  const renderChatWindow = () => (
    <div
      className={`ai-assistant-root ${isDark ? "theme-dark" : "theme-light"}`}
      style={{ width: embedMode === "embedded" ? "100%" : undefined }}
    >
      {/* Header */}
      <div className="ai-header flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <MessageSquare />
          <div>
            <div className="text-lg font-semibold">Cybercode AI Advisor</div>
            <div className="text-xs text-slate-400">Ask about courses, career roadmaps, and projects</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTyping && (
            <div className="typing-indicator" aria-hidden>
              <span /><span /><span />
            </div>
          )}

          {embedMode === "floating" ? (
            <button
              onClick={() => setIsOpen(false)}
              className="icon-btn"
              aria-label="Close chat"
            >
              <X />
            </button>
          ) : null}
        </div>
      </div>

      {/* Messages */}
      <div className="ai-messages flex-1 p-4" style={{ maxHeight: 360 }}>
        <div className="space-y-3">
          {messages.map((m, i) => renderMessage(m, i))}
          {isTyping && (
            <div className="chat-bubble chat-bot typing-bubble">
              <div className="chat-content">
                <div className="typing-indicator-inline"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>

        <div ref={chatEndRef} />
      </div>

      {/* Quick CTA */}
      <div className="px-4 pt-2 pb-0">
        <div className="quick-cta flex gap-2 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="quick-chip"
            >
              {q.length > 40 ? q.slice(0, 40) + "…" : q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
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
            <Send />
          </button>
        </div>
      </div>
    </div>
  );

  // If floating mode, show button + panel
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
          {isOpen ? <X /> : <MessageSquare />}
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
              <div className="rounded-2xl shadow-2xl overflow-hidden">
                {renderChatWindow()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Embedded
  return <div className="w-full">{renderChatWindow()}</div>;
};

export default AIAssistant;
