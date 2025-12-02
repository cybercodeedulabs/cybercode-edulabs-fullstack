// src/components/ui/FeatureItem.jsx
import { Icon } from "@iconify/react";

const iconClass =
  "w-10 h-10 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]";

const icons = {
  projects: <Icon icon="mdi:briefcase" className={iconClass} />,
  exposure: <Icon icon="mdi:account-group" className={iconClass} />,
  training: <Icon icon="mdi:book-open-page-variant" className={iconClass} />,
  certificate: <Icon icon="mdi:award" className={iconClass} />,

  // New icons (optional future use)
  ai: <Icon icon="mdi:cpu-64-bit" className={iconClass} />,
  cloud: <Icon icon="mdi:cloud-alert" className={iconClass} />,
  spark: <Icon icon="mdi:sparkles" className={iconClass} />,
};

function FeatureItem({ icon, title, description }) {
  return (
    <div
      className="
        relative rounded-2xl p-6 
        bg-white/80 dark:bg-gray-800/80 
        backdrop-blur-xl 
        shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)]
        border border-white/20 dark:border-gray-700/40
        transition-all duration-500 
        group cursor-pointer
        hover:-translate-y-2 hover:shadow-xl
      "
    >

      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Icon */}
      <div className="flex justify-center mb-4 transform transition-transform duration-500 group-hover:scale-110">
        {icons[icon]}
      </div>

      {/* Title */}
      <h4
        className="
          text-xl font-semibold 
          text-gray-900 dark:text-white 
          mb-2 tracking-wide
          transition-colors duration-500
          group-hover:text-indigo-600 dark:group-hover:text-indigo-400
        "
      >
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>

      {/* Glow ring on hover */}
      <div
        className="
        absolute inset-0 rounded-2xl 
        group-hover:ring-2 ring-indigo-400/40 
        transition-all duration-500 pointer-events-none
      "
      ></div>
    </div>
  );
}

export default FeatureItem;
