import { useRef } from "react";
import type { FormInputProps } from "../types/components";

export default function FormInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  step,
  min,
  max,
  suffix,
  icon,
  onIconClick,
  helperText,
}: FormInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick();
    } else if (type === "datetime-local" && inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  const isDateTimeInput = type === "datetime-local";

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute -translate-y-1/2 left-3 top-1/2 ${
              onIconClick || isDateTimeInput
                ? "cursor-pointer hover:text-gray-600"
                : ""
            }`}
            onClick={handleIconClick}
          >
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            icon ? "pl-10" : ""
          } ${suffix ? "pr-12" : ""} ${
            isDateTimeInput
              ? "cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              : ""
          }`}
          required={required}
        />
        {suffix && (
          <span className="absolute text-gray-600 -translate-y-1/2 right-3 top-1/2">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
    </div>
  );
}
