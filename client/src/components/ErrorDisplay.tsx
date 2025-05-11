import { Link } from "react-router";

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
    <div className={`text-center ${className}`}>
      <div className="text-4xl mb-4">❌</div>
      <h3 className="text-xl font-bold text-red-600 mb-2">{error}</h3>
      {showBackLink && (
        <Link to="/" className="text-blue-600 hover:underline">
          Back to the duck pond
        </Link>
      )}
    </div>
  );
}
