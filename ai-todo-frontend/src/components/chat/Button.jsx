function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        rounded-xl
        bg-gradient-to-r
        from-indigo-500
        to-violet-500
        py-4
        font-semibold
        text-white
        shadow-[0_0_24px_rgba(99,102,241,0.35)]
        transition-all
        duration-300
        hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]
        hover:scale-[1.02]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        disabled:shadow-none
      "
    >
      {children}
    </button>
  );
}

export default Button;
