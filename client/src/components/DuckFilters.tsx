import { DuckOptions } from "../@types";

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
  if (optionsLoading) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
      {/* Breed Filter */}
      <select
        value={filters.breed}
        onChange={(e) => onFilterChange({ ...filters, breed: e.target.value })}
        className="border-2 border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Breeds</option>
        {duckOptions?.breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      {/* Gender Filter */}
      <select
        value={filters.gender}
        onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
        className="border-2 border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Genders</option>
        {duckOptions?.genders.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>

      {/* Rubber Duck Filter */}
      <label className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
        <input
          type="checkbox"
          checked={filters.isRubberDuck}
          onChange={(e) =>
            onFilterChange({ ...filters, isRubberDuck: e.target.checked })
          }
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        Rubber Ducks Only
      </label>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-full transition-colors"
      >
        Reset All
      </button>
    </div>
  );
}
