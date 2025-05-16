// Update DuckDetail.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { DuckType } from "../@types";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { LikeButton } from "../components/LikeButton";
import { UploaderInfo } from "../components/UploaderInfo";
import { RubberDuckBadge } from "../components/RubberDuckBadge";
import { CommentSection } from "../components/comments/CommentSection";

export default function DuckDetail() {
  const { id } = useParams<{ id: string }>();
  const [duck, setDuck] = useState<DuckType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDuckAndLikeStatus = async () => {
      try {
        setLoading(true);
        setError("");

        const duckResponse = await fetch(
          `http://localhost:8000/api/ducks/${id}`
        );
        if (!duckResponse.ok) throw new Error("Duck not found");
        const duckData = await duckResponse.json();
        setDuck(duckData.duck);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load duck");
      } finally {
        setLoading(false);
      }
    };

    fetchDuckAndLikeStatus();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <LoadingIndicator text="Loading duck details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  if (!duck) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto pt-24 px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Duck Image */}
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={duck.image}
              alt={duck.name}
              className="absolute h-full w-full object-contain"
              style={{ objectPosition: "center" }}
            />
          </div>

          {/* Duck Info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-blue-900">{duck.name}</h1>

              <div className="flex items-center space-x-4">
                {duck.isRubberDuck && (
                  <RubberDuckBadge className="px-3 py-1 text-sm" />
                )}

                <LikeButton
                  duckId={duck._id}
                  initialLikes={duck.likes}
                  isAuthenticated={isAuthenticated}
                  uploadedBy={duck.uploadedBy}
                  className="text-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              {duck.breed && (
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">Breed:</span>
                  <span className="ml-2">{duck.breed}</span>
                </div>
              )}

              {duck.gender && (
                <div className="flex items-center text-blue-600">
                  <span className="font-medium">Gender:</span>
                  <span className="ml-2">{duck.gender}</span>
                </div>
              )}

              <UploaderInfo
                uploadedBy={duck.uploadedBy}
                className="text-sm text-gray-600"
              />

              <div className="text-sm text-gray-500">
                Added on {new Date(duck.uploadedAt).toLocaleDateString()}
              </div>
            </div>

            {duck.description && (
              <div className="prose max-w-none text-gray-700 mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  About {duck.name}
                </h3>
                <p>{duck.description}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection duckId={duck._id} />
      </div>
    </div>
  );
}
