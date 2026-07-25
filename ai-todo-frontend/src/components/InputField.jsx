import { forwardRef } from "react";

const InputField = forwardRef(function InputField(
  { label, type = "text", placeholder, icon: Icon, error, ...rest },
  ref
) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-[#7A7266]"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6A29C]" />
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full
            rounded-lg
            border
            ${error ? "border-red-400" : "border-[#E4DCC8]"}
            bg-white
            text-[#2B2118]
            placeholder:text-[#B8B0A0]
            ${Icon ? "pl-11" : "pl-4"}
            pr-4
            py-3
            outline-none
            transition-colors
            duration-200
            focus:border-[#5C3A21]
          `}
          style={{ fontFamily: "'Satoshi', sans-serif" }}
          {...rest}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default InputField;