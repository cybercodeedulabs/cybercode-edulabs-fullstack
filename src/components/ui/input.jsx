import { motion } from "framer-motion";
import React from "react";

export function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-2"
    >
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <motion.input
        whileFocus={{
          scale: 1.01,
          boxShadow: "0 0 0 3px rgba(99,102,241,0.3)",
        }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${className}`}
        {...props}
      />
    </motion.div>
  );
}
