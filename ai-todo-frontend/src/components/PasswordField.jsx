import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = forwardRef(function PasswordField(
  { label, placeholder, error, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-[#7A7266]"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`
            w-full
            rounded-lg
            border
            ${error ? "border-red-400" : "border-[#E4DCC8]"}
            bg-white
            text-[#2B2118]
            placeholder:text-[#B8B0A0]
            pl-4
            pr-11
            py-3
            outline-none
            transition-colors
            duration-200
            focus:border-[#5C3A21]
          `}
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6A29C] hover:text-[#5C3A21] transition-colors"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default PasswordField;