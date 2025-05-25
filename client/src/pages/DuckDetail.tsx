import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { DuckType } from "../@types";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { LikeButton } from "../components/LikeButton";
import { UploaderInfo } from "../components/UploaderInfo";
import { RubberDuckBadge } from "../components/RubberDuckBadge";
import { CommentSection } from "../components/comments/CommentSection";
import { API_ENDPOINTS } from "../config/api";
import { motion } from "framer-motion";

export default function DuckDetail() {
  const { id } = useParams<{ id: string }>();
  const [duck, setDuck] = useState<DuckType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  if (!id) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    const fetchDuckAndLikeStatus = async () => {
      try {
        setLoading(true);
        setError("");

        const duckResponse = await fetch(API_ENDPOINTS.DUCKS.SINGLE_DUCK(id));
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <LoadingIndicator text="Loading duck details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <ErrorDisplay error={error} />
      </div>
    );
  }

  if (!duck) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-8 pb-12 overflow-hidden relative">
      {/* Wave Background */}
      <div className="wave-background">
        <div className="wave-deep-layer"></div>
        <motion.div
          className="wave-layer-1"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-2"
          animate={{ backgroundPositionX: ["100%", "0%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-3"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto pt-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Duck Image with Wave Background */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-blue-100">
            <div className="absolute inset-0 wave-background">
              <div className="wave-deep-layer opacity-10"></div>
              <motion.div
                className="wave-layer-1 opacity-20"
                animate={{ backgroundPositionX: ["0%", "100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="wave-layer-2 opacity-15"
                animate={{ backgroundPositionX: ["100%", "0%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {duck.image ? (
              <motion.img
                src={duck.image}
                alt={duck.name}
                className="absolute h-full w-full object-contain z-10 p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="absolute h-full w-full flex items-center justify-center z-10">
                <span className="text-8xl text-yellow-300 opacity-80">🦆</span>
              </div>
            )}
          </div>

          {/* Duck Info */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <motion.h1
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {duck.name}
              </motion.h1>

              <div className="flex items-center gap-4">
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

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
              {duck.breed && (
                <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="font-medium">Breed:</span>
                  <span className="ml-2">{duck.breed}</span>
                </div>
              )}

              {duck.gender && (
                <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
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
              <motion.div
                className="prose max-w-none text-gray-700 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  About {duck.name}
                </h3>
                <p className="whitespace-pre-line">{duck.description}</p>
              </motion.div>
            )}

            <motion.div
              className="mt-6 pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
              >
                ← Back to Ducks
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Comment Section */}
        <motion.div
          className="mt-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CommentSection duckId={duck._id} />
        </motion.div>
      </div>
    </div>
  );
}
