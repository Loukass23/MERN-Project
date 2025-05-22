import { useState, useEffect } from "react";
import quack from "../assets/sounds/quack.mp3";

interface DuckSearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateClick: () => void;
  filter: "newest" | "oldest" | "popular";
  onFilterChange: (filter: "newest" | "oldest" | "popular") => void;
  isAuthenticated: boolean;
}

export function DuckSearchHeader({
  searchTerm,
  onSearchChange,
  onCreateClick,
  filter,
  onFilterChange,
  isAuthenticated,
}: DuckSearchHeaderProps) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioObj = new Audio(quack);
    audioObj.volume = 0.5;
    setAudio(audioObj);
    return () => {
      audioObj.pause();
    };
  }, []);

  const handleCreateClick = () => {
    if (!isAuthenticated && audio) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
    onCreateClick();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      {/* Search Input */}
      <div className="w-full md:flex-1 relative">
        <input
          type="text"
          placeholder="Search ducks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-3 pl-10 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-3.5 h-5 w-5 text-blue-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreateClick}
        className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-semibold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-yellow-600/30 flex items-center justify-center gap-2 group"
      >
        <span className="group-hover:scale-110 transition-transform">+</span>
        <span>Add Duck</span>
        <span className="group-hover:animate-bounce">🦆</span>
      </button>

      {/* Sort Dropdown */}
      <div className="relative w-full md:w-auto">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as any)}
          className="w-full bg-white border-2 border-blue-300 rounded-full pl-4 pr-8 py-2 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>
        <svg
          className="absolute right-2 top-2.5 h-4 w-4 text-blue-700 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
