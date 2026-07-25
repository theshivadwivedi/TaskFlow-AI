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
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: formatTime() }]);
    } catch (err) {
      setError("Couldn't reach the assistant. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#5C3A21] text-white font-medium text-sm border border-[#4A2E19] hover:bg-[#4A2E19] transition-colors duration-200"
        animate={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? "none" : "auto" }}
        aria-label="Open AI assistant"
      >
        <Sparkles size={16} />
        Ask AI
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 sm:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F7F3EC] border-l border-[#E4DCC8] z-50 flex flex-col"
            >
              <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-[#E4DCC8] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#5C3A21] flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2B2118] text-sm">Task Assistant</h3>
                    <p className="text-xs text-[#A6A29C]">Ask about your tasks</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#A6A29C] hover:text-[#5C3A21] transition-colors"
                  aria-label="Close assistant"
                >
                  <X size={19} />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-11 h-11 mb-4 rounded-lg bg-[#5C3A21] flex items-center justify-center">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <p className="text-[#A6A29C] text-sm mb-5">Ask me anything about your tasks</p>
                    <div className="flex flex-col gap-2 w-full">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="text-sm text-left bg-white border border-[#E4DCC8] rounded-lg px-4 py-2.5 text-[#7A7266] hover:border-[#5C3A21]/40 hover:text-[#2B2118] transition-colors"
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
                <div className="mx-4 mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="bg-white p-3 flex items-center gap-2 shrink-0 border-t border-[#E4DCC8]"
              >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your tasks..."
                className="flex-1 rounded-lg border border-[#E4DCC8] bg-[#F7F3EC] text-[#2B2118] placeholder:text-[#A6A29C] px-4 py-2.5 text-sm outline-none focus:border-[#5C3A21]/50 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-lg bg-[#5C3A21] text-white flex items-center justify-center hover:bg-[#4A2E19] disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatWidget;