import { DuckListType, User } from "../@types";
import { useNavigate } from "react-router";
import DuckCard from "./DuckCard";

interface DucksTabProps {
  ducks: DuckListType;
  user: User;
  isCurrentUserProfile: boolean;
  onEditDuck: (duck: any) => void;
}

export function DucksTab({
  ducks,
  user,
  isCurrentUserProfile,
  onEditDuck,
}: DucksTabProps) {
  const navigate = useNavigate();

  if (ducks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-8xl mb-4">🦆</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          {isCurrentUserProfile
            ? "No ducks uploaded yet!"
            : `${user.username} hasn't uploaded any ducks yet!`}
        </h3>
        {isCurrentUserProfile && (
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
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Your First Duck
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {ducks.map((duck) => (
        <div key={duck._id} className="relative group">
          <DuckCard duck={duck} />
          {isCurrentUserProfile && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditDuck(duck);
              }}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit Duck"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
