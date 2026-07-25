function MessageBubble({ role, content, timestamp }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-[#5C3A21] text-white"
              : "bg-white border border-[#E4DCC8] text-[#2B2118]"
          }`}
        >
          {content}
        </div>
        {timestamp && (
          <span className="text-[11px] text-[#A6A29C] px-1">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;