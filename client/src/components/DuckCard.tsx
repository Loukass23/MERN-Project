import { DuckType } from "../@types";
import { Link } from "react-router";
import { LikeButton } from "./LikeButton";
import { UploaderInfo } from "./UploaderInfo";
import { RubberDuckBadge } from "./RubberDuckBadge";
import { useAuth } from "../context/AuthContext";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

interface DuckCardProps {
  duck: DuckType;
  className?: string;
}

export default function DuckCard({ duck, className = "" }: DuckCardProps) {
  const { isAuthenticated } = useAuth();
  const floatY = useMotionValue(0);

  useEffect(() => {
    const floatAnimation = animate(floatY, [0, -10, 0], {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
    return () => floatAnimation.stop();
  }, [floatY]);

  return (
    <motion.div className={`relative ${className} w-full max-w-xs`}>
      <motion.div className="h-full" style={{ y: floatY }}>
        <motion.div
          className="h-full flex flex-col rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image section with visible wave background */}
          <Link to={`/ducks/${duck._id}`} className="block relative group">
            <div className="relative h-56 w-full overflow-hidden rounded-t-3xl bg-blue-100">
              {/* Wave background container */}
              <div className="duck-card-wave-bg">
                <motion.div
                  className="duck-card-wave-layer duck-card-wave-1"
                  animate={{ backgroundPositionX: ["0%", "100%"] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="duck-card-wave-layer duck-card-wave-2"
                  animate={{ backgroundPositionX: ["100%", "0%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Duck image */}
              {duck.image ? (
                <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                  <motion.img
                    src={duck.image}
                    alt={duck.name}
                    className="h-full w-full object-scale-down max-h-[180px]"
                    style={{
                      filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
                    }}
                  />
                </div>
              ) : (
                <div className="absolute h-full w-full flex items-center justify-center z-10">
                  <span className="text-7xl text-yellow-300 opacity-80">
                    🦆
                  </span>
                </div>
              )}

              {/* gradient overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-400/30 to-transparent z-0 rounded-b-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </Link>

          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {duck.name}
                </h3>
                <span className="text-xs text-gray-400">
                  Added {new Date(duck.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              {duck.isRubberDuck && <RubberDuckBadge />}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {duck.gender && (
                <span className="text-xs text-gray-600 px-2 py-1 bg-blue-50 rounded-full">
                  {duck.gender}
                </span>
              )}
              {duck.breed && (
                <span className="text-xs text-gray-600 px-2 py-1 bg-blue-50 rounded-full">
                  {duck.breed}
                </span>
              )}
            </div>

            <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100">
              <UploaderInfo uploadedBy={duck.uploadedBy} className="text-xs" />
              {isAuthenticated && (
                <LikeButton
                  duckId={duck._id}
                  initialLikes={duck.likes}
                  isAuthenticated={isAuthenticated}
                  uploadedBy={duck.uploadedBy}
                  className="text-xs"
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
