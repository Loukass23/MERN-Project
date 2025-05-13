import { ReactNode, useEffect, useRef } from "react";
import quack from "../assets/sounds/funnyquack.mp3";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  playQuack?: boolean;
}

export function FunnyModal({
  isOpen,
  onClose,
  children,
  className = "",
  playQuack = false,
}: ModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playQuack) return;

    audioRef.current = new Audio(quack);
    audioRef.current.volume = 0.8;

    return () => {
      audioRef.current?.pause();
    };
  }, [playQuack]);

  useEffect(() => {
    if (isOpen && playQuack && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }

    // need to fix moving heart
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, playQuack]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`animate-[feather-drop_0.8s] bg-white/90 p-6 rounded-2xl shadow-xl max-w-xs border-2 border-yellow-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
