import { useState, useEffect } from "react";
import { DuckOptions } from "../../@types";
import { API_ENDPOINTS } from "../../config/api";

type DuckFilterType = "newest" | "oldest" | "popular";

export function useDuckFilters(initialFilter: DuckFilterType = "newest") {
  const [filter, setFilter] = useState<DuckFilterType>(initialFilter);
  const [filters, setFilters] = useState({
    breed: "",
    gender: "",
    isRubberDuck: false,
  });
  const [duckOptions, setDuckOptions] = useState<DuckOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const resetAllFilters = () => {
    setFilters({ breed: "", gender: "", isRubberDuck: false });
    setFilter("newest");
  };

  // Type-safe filter setter
  const handleFilterChange = (newFilter: DuckFilterType) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.DUCKS.OPTIONS);
        const data = await response.json();
        setDuckOptions(data.options);
      } catch (error) {
        console.error("Error fetching duck options:", error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return {
    filter,
    filters,
    duckOptions,
    optionsLoading,
    setFilter: handleFilterChange,
    setFilters,
    resetAllFilters,
  };
}
