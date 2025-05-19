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
    <div className={`block ${className}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Clickable Image */}
        <Link to={`/ducks/${duck._id}`} className="block group">
          <div className="relative h-48 w-full overflow-hidden">
            {duck.image ? (
              <img
                src={duck.image}
                alt={duck.name}
                className="absolute h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="absolute h-full w-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </Link>

        {/* Clickable Title */}
        <div className="p-4 flex-grow">
          <Link
            to={`/ducks/${duck._id}`}
            className="hover:underline block mb-2"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-blue-900">{duck.name}</h3>
              {duck.isRubberDuck && <RubberDuckBadge />}
            </div>
          </Link>

          {/* Non-clickable breed/gender info */}
          <div className="flex items-center text-sm text-blue-600 mb-3">
            <span className="mr-3">{duck.breed || "Unknown breed"}</span>
            <span className="mr-3">{duck.gender || "Unknown gender"}</span>
          </div>

          {/* Uploader info (contains its own link) */}
          <UploaderInfo uploadedBy={duck.uploadedBy} />
        </div>

        {/* Footer (non-clickable) */}
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {new Date(duck.uploadedAt).toLocaleDateString()}
            </span>
            <LikeButton
              duckId={duck._id}
              initialLikes={duck.likes}
              isAuthenticated={isAuthenticated}
              uploadedBy={duck.uploadedBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
