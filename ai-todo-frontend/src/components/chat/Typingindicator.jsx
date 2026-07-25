function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-[#E4DCC8] rounded-xl px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5C3A21] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#5C3A21] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#5C3A21] animate-bounce" />
      </div>
    </div>
  );
}

export default TypingIndicator;