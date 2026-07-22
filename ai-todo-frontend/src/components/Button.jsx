function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-xl
        bg-indigo-500
        py-4
        font-semibold
        text-white
        transition-colors
        duration-200
        hover:bg-indigo-400
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:bg-indigo-500
      "
    >
      {children}
    </button>
  );
}

export default Button;