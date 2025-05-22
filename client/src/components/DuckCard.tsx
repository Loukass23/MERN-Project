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

// import { DuckType } from "../@types";
// import { Link } from "react-router";
// import { LikeButton } from "./LikeButton";
// import { UploaderInfo } from "./UploaderInfo";
// import { RubberDuckBadge } from "./RubberDuckBadge";
// import { useAuth } from "../context/AuthContext";
// import { motion, useMotionValue, animate } from "framer-motion";
// import { useEffect, useState } from "react";

// interface DuckCardProps {
//   duck: DuckType;
//   className?: string;
// }

// export default function DuckCard({ duck, className = "" }: DuckCardProps) {
//   const { isAuthenticated, user } = useAuth();
//   const [isHovered, setIsHovered] = useState(false);
//   const [isClicked, setIsClicked] = useState(false);

//   // Motion values for 3D tilt effect
//   const tiltX = useMotionValue(0);
//   const tiltY = useMotionValue(0);
//   const rotateX = useMotionValue(0);
//   const rotateY = useMotionValue(0);

//   // Separate motion value for floating animation
//   const floatY = useMotionValue(0);

//   // Water ripple effect on click
//   const handleClick = () => {
//     setIsClicked(true);
//     setTimeout(() => setIsClicked(false), 1000);
//   };

//   // Floating animation for ducks
//   useEffect(() => {
//     const floatAnimation = animate(floatY, [0, -10, 0], {
//       duration: 3 + Math.random() * 2,
//       repeat: Infinity,
//       repeatType: "reverse",
//       ease: "easeInOut",
//     });
//     return () => floatAnimation.stop();
//   }, [floatY]);

//   return (
//     <motion.div
//       className={`relative ${className} w-full max-w-xs`}
//       style={{ perspective: "1000px" }}
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       onClick={handleClick}
//     >
//       {/* Floating water bubbles */}
//       {isHovered && (
//         <>
//           <motion.span
//             className="absolute text-xl opacity-70"
//             initial={{ y: 0, x: -10, opacity: 0 }}
//             animate={{
//               y: -50,
//               x: [0, 5, -5, 0],
//               opacity: [0, 0.7, 0],
//             }}
//             transition={{
//               duration: 2,
//               ease: "easeOut",
//             }}
//             style={{ left: "20%" }}
//           >
//             💧
//           </motion.span>
//           <motion.span
//             className="absolute text-lg opacity-70"
//             initial={{ y: 0, x: 10, opacity: 0 }}
//             animate={{
//               y: -70,
//               x: [0, -8, 8, 0],
//               opacity: [0, 0.5, 0],
//             }}
//             transition={{
//               duration: 2.5,
//               ease: "easeOut",
//               delay: 0.3,
//             }}
//             style={{ left: "80%" }}
//           >
//             💧
//           </motion.span>
//         </>
//       )}

//       {/* Click ripple effect */}
//       {isClicked && (
//         <motion.div
//           className="absolute inset-0 rounded-2xl bg-blue-200 pointer-events-none"
//           initial={{ scale: 0.5, opacity: 0.7 }}
//           animate={{ scale: 1.5, opacity: 0 }}
//           transition={{ duration: 1 }}
//         />
//       )}

//       {/* MAIN CARD - 3D TILT EFFECT */}
//       <motion.div
//         className="h-full"
//         style={{
//           rotateX,
//           rotateY,
//           // background,
//           transformStyle: "preserve-3d",
//           y: floatY,
//         }}
//         whileHover={{ scale: 1.03 }}
//         onPointerMove={(e) => {
//           const rect = e.currentTarget.getBoundingClientRect();
//           const centerX = rect.left + rect.width / 2;
//           const centerY = rect.top + rect.height / 2;

//           tiltX.set(e.clientX - centerX);
//           tiltY.set(e.clientY - centerY);

//           rotateX.set((e.clientY - centerY) / 20);
//           rotateY.set((centerX - e.clientX) / 20);
//         }}
//         onPointerLeave={() => {
//           animate(rotateX, 0, { duration: 0.5 });
//           animate(rotateY, 0, { duration: 0.5 });
//           animate(tiltX, 0, { duration: 0.5 });
//           animate(tiltY, 0, { duration: 0.5 });
//         }}
//       >
//         {/* CARD CONTAINER */}
//         <motion.div
//           className="h-full flex flex-col rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl backdrop-blur-sm"
//           style={{
//             boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
//             background:
//               "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.95) 100%)",
//           }}
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* IMAGE SECTION WITH WATER REFLECTION */}
//           <Link to={`/ducks/${duck._id}`} className="block relative group">
//             <div className="relative h-56 w-full overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 rounded-t-3xl">
//               {/* Water surface effect */}
//               <motion.div
//                 className="absolute bottom-0 left-0 right-0 h-12 bg-blue-300/20 rounded-b-3xl"
//                 animate={{
//                   backgroundPosition: ["0% 0%", "100% 100%"],
//                 }}
//                 transition={{
//                   duration: 10,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//                 style={{
//                   backgroundImage:
//                     "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)",
//                   backgroundSize: "200% 100%",
//                 }}
//               />

//               {/* Duck image */}
//               {duck.image ? (
//                 <div className="absolute inset-0 flex items-center justify-center p-4">
//                   <motion.img
//                     src={duck.image}
//                     alt={duck.name}
//                     className="h-full w-full object-scale-down max-h-[180px]"
//                     style={{
//                       filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
//                     }}
//                   />
//                 </div>
//               ) : (
//                 <div className="absolute h-full w-full flex items-center justify-center z-10">
//                   <span className="text-7xl text-yellow-300 opacity-80">
//                     🦆
//                   </span>
//                 </div>
//               )}

//               {/* Water reflection */}
//               <motion.div
//                 className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-400/30 to-transparent z-0 rounded-b-3xl"
//                 animate={{ opacity: [0.3, 0.5, 0.3] }}
//                 transition={{ duration: 3, repeat: Infinity }}
//               />
//             </div>
//           </Link>

//           {/* CARD CONTENT - UPDATED DATE POSITION */}
//           <div className="p-4 flex-1 flex flex-col">
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {duck.name}
//                 </h3>
//                 <span className="text-xs text-gray-400">
//                   Added {new Date(duck.uploadedAt).toLocaleDateString()}
//                 </span>
//               </div>
//               {duck.isRubberDuck && <RubberDuckBadge />}
//             </div>

//             {/* Duck info - simplified tags */}
//             <div className="flex flex-wrap gap-2 mb-3">
//               {duck.gender && (
//                 <span className="text-xs text-gray-600 px-2 py-1 bg-blue-50 rounded-full">
//                   {duck.gender}
//                 </span>
//               )}
//               {duck.breed && (
//                 <span className="text-xs text-gray-600 px-2 py-1 bg-blue-50 rounded-full">
//                   {duck.breed}
//                 </span>
//               )}
//             </div>

//             <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100">
//               <UploaderInfo uploadedBy={duck.uploadedBy} className="text-xs" />
//               {isAuthenticated && (
//                 <LikeButton
//                   duckId={duck._id}
//                   initialLikes={duck.likes}
//                   isAuthenticated={isAuthenticated}
//                   uploadedBy={duck.uploadedBy}
//                   className="text-xs"
//                 />
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }
