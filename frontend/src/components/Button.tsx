import type { ButtonProps } from "../types/components";

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  onClick,
  disabled,
  fullWidth,
}: ButtonProps) {
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-500 text-white",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 font-semibold transition-colors rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? "w-full" : ""}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
