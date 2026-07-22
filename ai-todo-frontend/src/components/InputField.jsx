import { forwardRef } from "react";
import { Mail } from "lucide-react";

const InputField = forwardRef(function InputField(
  { label, type = "text", placeholder, icon: Icon = Mail, error, ...rest },
  ref
) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            ${error ? "border-red-400" : "border-gray-300"}
            bg-white
            pl-12
            pr-4
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
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default InputField;