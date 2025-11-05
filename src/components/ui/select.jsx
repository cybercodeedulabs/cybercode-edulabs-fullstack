// src/components/ui/select.jsx
import React from "react";

export function Select({ label, children, value, onValueChange, className = "", ...props }) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`
          w-full px-4 py-2 border rounded-lg
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function SelectItem({ label, value, ...props }) {
  return (
    <option value={value} {...props}>
      {label}
    </option>
  );
}
