import { DuckOptions } from "../@types";
import { motion } from "framer-motion";

interface DuckFiltersProps {
  filters: {
    breed: string;
    gender: string;
    isRubberDuck: boolean;
  };
  duckOptions: DuckOptions | null;
  optionsLoading: boolean;
  onFilterChange: (newFilters: any) => void;
  onReset: () => void;
}

export function DuckFilters({
  filters,
  duckOptions,
  optionsLoading,
  onFilterChange,
  onReset,
}: DuckFiltersProps) {
  if (optionsLoading) {
    return (
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse bg-blue-100 rounded-xl p-4 w-full max-w-3xl h-16"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-wrap items-center gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border-2 border-blue-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breed Filter with Duck Icon */}
      <div className="relative">
        <motion.div whileHover={{ scale: 1.03 }}>
          <select
            value={filters.breed}
            onChange={(e) =>
              onFilterChange({ ...filters, breed: e.target.value })
            }
            className="border-2 border-blue-200 rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none bg-white min-w-[180px]"
          >
            <option value="">All Breeds</option>
            {duckOptions?.breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </motion.div>
        <div className="absolute left-3 top-2.5 text-blue-400 text-lg">
          {filters.breed ? "🦆" : "🔍"}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="relative">
        <motion.div whileHover={{ scale: 1.03 }}>
          <select
            value={filters.gender}
            onChange={(e) =>
              onFilterChange({ ...filters, gender: e.target.value })
            }
            className="border-2 border-blue-200 rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none bg-white min-w-[180px]"
          >
            <option value="">All Genders</option>
            {duckOptions?.genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </motion.div>
        <div className="absolute left-3 top-2.5 text-blue-400 text-lg">
          {filters.gender === "Male"
            ? "♂"
            : filters.gender === "Female"
            ? "♀"
            : "👥"}
        </div>
      </div>

      {/* Rubber Duck Filter */}
      <motion.div
        className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors ${
          filters.isRubberDuck
            ? "bg-yellow-100 border-yellow-300"
            : "bg-blue-100 border-blue-200"
        } border-2`}
        whileHover={{ scale: 1.05 }}
        onClick={() =>
          onFilterChange({ ...filters, isRubberDuck: !filters.isRubberDuck })
        }
      >
        <motion.div
          animate={{
            rotate: filters.isRubberDuck ? [0, 15, -15, 0] : 0,
            scale: filters.isRubberDuck ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          {filters.isRubberDuck ? (
            <span className="text-2xl">🦆</span>
          ) : (
            <span className="text-xl text-blue-500">🦆</span>
          )}
        </motion.div>
        <span
          className={`font-medium ${
            filters.isRubberDuck ? "text-yellow-700" : "text-blue-700"
          }`}
        >
          {filters.isRubberDuck ? "Rubber Ducks!" : "Rubber Ducks"}
        </span>
      </motion.div>

      {/* Reset Button with Animation */}
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors font-medium"
      >
        <motion.span
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ duration: 0.7 }}
        >
          🔄
        </motion.span>
        Reset All
      </motion.button>

      {/* Active Filters Indicator */}
      {(filters.breed || filters.gender || filters.isRubberDuck) && (
        <motion.div
          className="ml-auto text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <span className="text-xs">🔍</span>
          <span>Filters Active</span>
        </motion.div>
      )}
    </motion.div>
  );
}
