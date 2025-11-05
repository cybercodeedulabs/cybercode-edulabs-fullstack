import { motion } from "framer-motion";

export function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
