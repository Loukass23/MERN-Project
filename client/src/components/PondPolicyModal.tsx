// keep for now

// import { useEffect, useRef } from "react";
// import quack from "../assets/sounds/quack.mp3";

// export default function PondPolicyModal({
//   isOpen,
//   onClose,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     audioRef.current = new Audio(quack);
//     audioRef.current.volume = 0.8; // volume

//     return () => {
//       // Cleanup when unmounted
//       audioRef.current?.pause();
//     };
//   }, []);

//   // Play sound when modal opens
//   useEffect(() => {
//     if (isOpen && audioRef.current) {
//       audioRef.current.currentTime = 0; // Rewind to start
//       audioRef.current.play().catch((e) => {
//         console.log("Quack blocked by browser:", e);
//       });
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="animate-[feather-drop_0.8s] bg-white/90 p-6 rounded-2xl shadow-xl max-w-xs border-2 border-yellow-300">
//         <div className="text-center">
//           <p className="text-lg font-medium text-gray-800 mb-2">
//             🦆 <span className="text-yellow-500">Pond Policies</span> 🦆
//           </p>
//           <p className="text-sm text-gray-600">
//             Quack responsibly: Be kind, post ducks, no bread crimes.
//           </p>
//           <button
//             onClick={onClose}
//             className="mt-4 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm hover:bg-yellow-300 transition-colors"
//           >
//             Understood!
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
