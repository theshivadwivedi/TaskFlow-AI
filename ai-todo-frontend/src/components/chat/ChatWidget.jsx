import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { sendChatMessage } from "../../services/chatService";

const SUGGESTIONS = [
  "What are my high-priority tasks?",
  "Which tasks are due today?",
  "Summarize my current workload",
  "Suggest what I should work on next",
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(text) {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed, timestamp: formatTime() }]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, timestamp: formatTime() },
      ]);
    } catch (err) {
      setError("Couldn't reach the assistant. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        animate={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? "none" : "auto" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-indigo-500"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 bg-gradient-to-br from-indigo-600 to-violet-600 text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-indigo-300/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open AI assistant"
        >
          <Sparkles size={20} />
          <span className="font-semibold text-sm hidden sm:inline">Ask AI</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F5F7FB] shadow-2xl z-50 flex flex-col"
            >
              <div className="bg-white px-5 py-4 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 blur-[7px]"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Task Assistant</h3>
                    <p className="text-xs text-gray-400">Ask about your tasks</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close assistant"
                >
                  <X size={20} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="relative w-12 h-12 mb-4">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 blur-[8px]"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
                    </div>
                    <p className="text-gray-500 text-sm mb-5">
                      Ask me anything about your tasks
                    </p>
                    <div className="flex flex-col gap-2 w-full">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="text-sm text-left bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} timestamp={m.timestamp} />
                ))}

                {isTyping && <TypingIndicator />}
              </div>

              {error && (
                <div className="mx-4 mb-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="bg-white p-3 flex items-center gap-2 shrink-0 border-t border-gray-100"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your tasks..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatWidget;