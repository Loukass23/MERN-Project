import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  text?: string;
  className?: string;
}

export function LoadingIndicator({
  text = "Loading ducks...",
  className = "",
}: LoadingIndicatorProps) {
  const waveVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const duckVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Wave Background */}
      <motion.div
        className="relative h-24 w-24 mb-8"
        initial="initial"
        animate="animate"
      >
        {/* Duck */}
        <motion.div
          className="absolute z-10 text-5xl left-1/2 -translate-x-1/2"
          variants={duckVariants}
          style={{ originY: 0.8 }}
        >
          🦆
        </motion.div>

        {/* Water Waves */}
        <motion.svg
          className="absolute bottom-0"
          width="96"
          height="24"
          viewBox="0 0 96 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          variants={waveVariants}
        >
          <path
            d="M0 12C15 0 31 24 48 12C65 0 81 24 96 12"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 18C15 6 31 30 48 18C65 6 81 30 96 18"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-6 text-blue-600 text-lg font-medium"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        {text}
      </motion.p>
    </div>
  );
}
