import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  labelClassName?: string;
}

const Toggle = ({ checked, onChange, labelClassName }: ToggleProps) => (
  <label className="flex items-center cursor-pointer select-none gap-3">
    <span
      className={`font-medium text-zinc-800 dark:text-zinc-200 ${labelClassName || "text-base"}`}
    >
      Dark Mode
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange()}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none flex items-center ${checked ? "bg-brand" : "bg-zinc-200"}`}
      style={{ width: 34, height: 20 }}
    >
      <span
        className="absolute left-1 transition-all duration-200 rounded-full shadow"
        style={{
          width: 14,
          height: 14,
          left: checked ? 17 : 3,
          background: "rgba(0,0,0,0.5)",
        }}
      />
    </button>
  </label>
);

export default Toggle;
