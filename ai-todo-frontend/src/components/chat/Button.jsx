function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-lg
        bg-[#5C3A21]
        py-3.5
        font-semibold
        text-white
        transition-colors
        duration-200
        hover:bg-[#4A2E19]
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {children}
    </button>
  );
}

export default Button;