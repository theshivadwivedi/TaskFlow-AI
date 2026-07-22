import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordField = forwardRef(function PasswordField(
  { label, placeholder, error, ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            ${error ? "border-red-400" : "border-gray-300"}
            bg-white
            pl-12
            pr-14
            py-4
            outline-none
            transition-all
            duration-300
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-100
          `}
          {...rest}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default PasswordField;