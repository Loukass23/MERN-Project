import { DuckListType } from "../@types";
import DuckCard from "./DuckCard";
import { useNavigate } from "react-router";

interface LikedDucksTabProps {
  ducks: DuckListType;
}

export function LikedDucksTab({ ducks }: LikedDucksTabProps) {
  const navigate = useNavigate();

  if (ducks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-8xl mb-4">🦆</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          No liked ducks yet!
        </h3>
        <button
          onClick={() => navigate("/ducks")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Browse Ducks
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ducks.map((duck) => (
        <div key={duck._id}>
          <DuckCard duck={duck} />
        </div>
      ))}
    </div>
  );
}
