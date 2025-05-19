import { useEffect, useState, useRef } from "react";
import { DuckListType, DuckOptions } from "../@types";
import { useAuth } from "../context/AuthContext";
import DuckCard from "../components/DuckCard";
import CreateDuckForm from "../components/CreateDuckForm";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Modal } from "../components/Modal";
import quack from "../assets/sounds/quack.mp3";
import { API_ENDPOINTS } from "../config/api";

function Ducks() {
  const [allDucks, setDucks] = useState<DuckListType>([]);
  const [filter, setFilter] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [filters, setFilters] = useState({
    breed: "",
    gender: "",
    isRubberDuck: false,
  });
  const [duckOptions, setDuckOptions] = useState<DuckOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(quack);
    audioRef.current.volume = 0.8;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (showLoginPrompt && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }
  }, [showLoginPrompt]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [optionsRes, ducksRes] = await Promise.all([
          fetch(API_ENDPOINTS.DUCKS.OPTIONS),
          fetch(`${API_ENDPOINTS.DUCKS.BASE}?sort=-uploadedAt`),
        ]);

        const [optionsData, ducksData] = await Promise.all([
          optionsRes.json(),
          ducksRes.json(),
        ]);

        setDuckOptions(optionsData.options);
        setDucks(ducksData.ducks);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!duckOptions) return;

    const fetchDucks = async () => {
      try {
        const sortParam = {
          popular: "-likes",
          oldest: "uploadedAt",
          newest: "-uploadedAt",
        }[filter];

        const params = new URLSearchParams({ sort: sortParam });
        if (filters.breed) params.append("breed", filters.breed);
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.isRubberDuck) params.append("isRubberDuck", "true");

        const response = await fetch(`${API_ENDPOINTS.DUCKS.BASE}?${params}`);
        setDucks((await response.json()).ducks);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDucks();
  }, [filter, filters, duckOptions]);

  const handleDuckCreated = async () => {
    setShowCreateForm(false);
    const sortParam = {
      popular: "-likes",
      oldest: "uploadedAt",
      newest: "-uploadedAt",
    }[filter];

    const params = new URLSearchParams({ sort: sortParam });
    if (filters.breed) params.append("breed", filters.breed);
    if (filters.gender) params.append("gender", filters.gender);
    if (filters.isRubberDuck) params.append("isRubberDuck", "true");

    const response = await fetch(`${API_ENDPOINTS.DUCKS.BASE}?${params}`);
    setDucks((await response.json()).ducks);
  };

  const handleCreateDuckClick = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCreateForm(true);
  };

  const resetAllFilters = () => {
    setFilters({ breed: "", gender: "", isRubberDuck: false });
    setFilter("newest");
    setSearchTerm("");
  };

  const filteredDucks = allDucks.filter((duck) =>
    [duck.name, duck.breed, duck.description].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <LoadingIndicator text="Loading ducks..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Login Prompt Modal */}
      <Modal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)}>
        {/* <div className="animate-[feather-drop_0.8s] bg-white/90 p-6 rounded-2xl shadow-xl max-w-xs border-2 border-yellow-300"> */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">
            🦆 <span className="text-yellow-500">Quack Alert!</span> 🦆
          </p>
          <p className="text-sm text-gray-600">
            To add your duck to the pond, please login or register first!
          </p>
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="mt-4 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm hover:bg-yellow-300 transition-colors"
          >
            Okay!
          </button>
        </div>
        {/* </div> */}
      </Modal>

      <div className="container mx-auto pt-24 px-4 py-8">
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search - Left */}
          <div className="w-full md:flex-1 relative">
            <input
              type="text"
              placeholder="Search ducks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Create Button - Center */}
          <button
            onClick={handleCreateDuckClick}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-semibold py-2 px-6 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-yellow-600/30 flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">
              +
            </span>
            <span>Add Duck</span>
            <span className="group-hover:animate-bounce">🦆</span>
          </button>

          {/* Sort Filter - Right */}
          <div className="relative w-full md:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
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

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <select
            value={filters.breed}
            onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
            className="border-2 border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Breeds</option>
            {duckOptions?.breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="border-2 border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            {duckOptions?.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <input
              type="checkbox"
              checked={filters.isRubberDuck}
              onChange={(e) =>
                setFilters({ ...filters, isRubberDuck: e.target.checked })
              }
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            Rubber Ducks Only
          </label>

          <button
            onClick={resetAllFilters}
            className="text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-full transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* Create Duck Form */}
        {showCreateForm && duckOptions && (
          <div className="mb-8">
            <CreateDuckForm
              onDuckCreated={handleDuckCreated}
              options={duckOptions}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Duck Cards Grid */}
        {filteredDucks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦆</div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              No ducks found!
            </h3>
            <p className="text-blue-600">
              {searchTerm ||
              filters.breed ||
              filters.gender ||
              filters.isRubberDuck
                ? "Try adjusting your filters"
                : "The pond is empty"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDucks.map((duck) => (
              <DuckCard key={duck._id} duck={duck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ducks;
