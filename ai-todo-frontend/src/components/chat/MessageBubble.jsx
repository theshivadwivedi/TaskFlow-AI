import { motion } from "framer-motion";

function MessageBubble({ role, content, timestamp }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="relative w-7 h-7 shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 blur-[6px]"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm"
          }`}
        >
          {content}
        </div>
        {timestamp && (
          <span className="text-[11px] text-gray-400 mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default MessageBubble;