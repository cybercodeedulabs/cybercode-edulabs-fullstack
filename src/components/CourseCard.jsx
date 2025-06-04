import { Link } from "react-router-dom";

function CourseCard({ title, slug, description }) {
  return (
    <Link to={`/courses/${slug}`}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
        </div>
        <div className="mt-4 text-sm text-indigo-500 hover:underline">View Details →</div>
      </div>
    </Link>
  );
}

export default CourseCard;
