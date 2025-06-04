import { Briefcase, BookOpen, Award, Users } from "lucide-react";

const icons = {
  projects: <Briefcase className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  exposure: <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  training: <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
  certificate: <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
};

function FeatureItem({ icon, title, description }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
      <div className="mb-4">
        {icons[icon]}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

export default FeatureItem;
