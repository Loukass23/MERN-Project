import { Link } from "react-router";
import { motion } from "framer-motion";

interface ErrorDisplayProps {
  error: string;
  className?: string;
  showBackLink?: boolean;
}

export function ErrorDisplay({
  error,
  className = "",
  showBackLink = true,
}: ErrorDisplayProps) {
  return (
    <motion.div
      className={`text-center p-6 bg-white rounded-xl shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-600 mb-2">{error}</h3>
      {showBackLink && (
        <Link
          to="/"
          className="text-blue-600 hover:underline inline-flex items-center mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to the duck pond
        </Link>
      )}
    </motion.div>
  );
}
