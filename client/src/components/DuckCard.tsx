import { DuckType } from "../@types";
import { Link } from "react-router";
import { LikeButton } from "./LikeButton";
import { UploaderInfo } from "./UploaderInfo";
import { RubberDuckBadge } from "./RubberDuckBadge";
import { useAuth } from "../context/AuthContext";
import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface DuckCardProps {
  duck: DuckType;
  className?: string;
}

export default function DuckCard({ duck, className = "" }: DuckCardProps) {
  const { isAuthenticated } = useAuth();
  const [isClicked, setIsClicked] = useState(false);
  const [activeBubbles, setActiveBubbles] = useState<number[]>([]);
  const bubbleIntervalRef = useRef<number | undefined>(undefined);
  const nextBubbleId = useRef<number>(0);

  // Motion values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const floatY = useMotionValue(0);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  // Floating animation
  useEffect(() => {
    const floatAnimation = animate(floatY, [0, -10, 0], {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
    return () => floatAnimation.stop();
  }, [floatY]);

  //  bubble effect
  useEffect(() => {
    //  initial burst
    const initialBubbles = Array.from(
      { length: 2 },
      () => nextBubbleId.current++
    );
    setActiveBubbles(initialBubbles);

    // Slower continuous flow
    bubbleIntervalRef.current = window.setInterval(() => {
      const newBubbles = Array.from(
        { length: Math.floor(Math.random() * 1) + 1 }, // 1-2 bubbles at a time
        () => nextBubbleId.current++
      );
      setActiveBubbles((prev) => [...prev.slice(-8), ...newBubbles]); // Max 8 bubbles
    }, 1500 + Math.random() * 2000); // 1.5-3.5 second intervals

    return () => {
      if (bubbleIntervalRef.current !== undefined) {
        window.clearInterval(bubbleIntervalRef.current);
      }
    };
  }, []);

  const removeBubble = (id: number) => {
    setActiveBubbles((prev) => prev.filter((bubbleId) => bubbleId !== id));
  };

  return (
    <motion.div
      className={`relative ${className} w-full max-w-xs`}
      style={{ perspective: "1000px" }}
      onClick={handleClick}
    >
      {/* Optimized bubble effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {activeBubbles.map((bubbleId) => (
          <motion.span
            key={bubbleId}
            className="absolute text-xl"
            style={{
              fontSize: `${Math.random() * 15 + 8}px`,
              left: `${Math.random() * 100}%`,
              bottom: "0%",
              zIndex: 10,
            }}
            initial={{
              y: 0,
              x: 0,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: -80 - Math.random() * 80,
              x: (Math.random() - 0.5) * 20,
              opacity: [0, 0.7, 0],
              scale: [0.8, 1, 0.9],
            }}
            transition={{
              duration: 2 + Math.random(),
              ease: "easeOut",
            }}
            onAnimationComplete={() => removeBubble(bubbleId)}
          >
            {Math.random() > 0.8 ? "💧" : "🫧"}
          </motion.span>
        ))}
      </div>

      {/* Click ripple */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-blue-200 pointer-events-none"
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      )}

      {/* Main card */}
      <motion.div
        className="h-full"
        style={{
          rotateX,
          rotateY,
          y: floatY,
        }}
        whileHover={{ scale: 1.03 }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          tiltX.set(e.clientX - centerX);
          tiltY.set(e.clientY - centerY);

          rotateX.set((e.clientY - centerY) / 20);
          rotateY.set((centerX - e.clientX) / 20);
        }}
        onPointerLeave={() => {
          animate(rotateX, 0, { duration: 0.5 });
          animate(rotateY, 0, { duration: 0.5 });
        }}
      >
        {/* Card container */}
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
          {/* Image section */}
          <Link to={`/ducks/${duck._id}`} className="block relative group">
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 rounded-t-3xl">
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-12 bg-blue-300/20 rounded-b-3xl"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)",
                  backgroundSize: "200% 100%",
                }}
              />

              {duck.image ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
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

              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-400/30 to-transparent z-0 rounded-b-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </Link>

          {/* Card content */}
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
