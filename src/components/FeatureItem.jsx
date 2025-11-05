// src/components/ui/FeatureItem.jsx
import { Briefcase, BookOpen, Award, Users } from "lucide-react";

const icons = {
  projects: <Briefcase className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  exposure: <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  training: <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  certificate: <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
};

function FeatureItem({ icon, title, description }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group">
      {/* Icon with subtle hover scale */}
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        {icons[icon]}
      </div>

      {/* Title */}
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
        {title}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

export default FeatureItem;
