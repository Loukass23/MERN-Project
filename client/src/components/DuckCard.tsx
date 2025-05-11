import { DuckType } from "../@types";
import { Link } from "react-router";
import { LikeButton } from "./LikeButton";
import { UploaderInfo } from "./UploaderInfo";
import { RubberDuckBadge } from "./RubberDuckBadge";
import { useAuth } from "../context/AuthContext";

interface DuckCardProps {
  duck: DuckType;
  className?: string;
}

export default function DuckCard({ duck, className = "" }: DuckCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Link to={`/ducks/${duck._id}`} className={`block ${className}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Duck Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={duck.image}
            alt={duck.name}
            className="absolute h-full w-full object-contain"
            style={{ objectPosition: "center" }}
          />
        </div>

        {/* Duck Info */}
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-blue-900">{duck.name}</h3>
            {duck.isRubberDuck && <RubberDuckBadge />}
          </div>

          <div className="flex items-center text-sm text-blue-600 mb-3">
            <span className="mr-3">{duck.breed || "Unknown breed"}</span>
            <span className="mr-3">{duck.gender || "Unknown gender"}</span>
          </div>

          <UploaderInfo uploadedBy={duck.uploadedBy} />
        </div>

        {/* Footer with date and like button */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {new Date(duck.uploadedAt).toLocaleDateString()}
            </span>

            <LikeButton
              duckId={duck._id}
              initialLikes={duck.likes}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
