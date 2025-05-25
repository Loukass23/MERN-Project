import { useEffect, useState } from "react";
import { DuckListType, PaginatedDuckResponse } from "../../@types";
import { API_ENDPOINTS } from "../../config/api";

export function useDucksData(filter: string, filters: any, page: number = 1) {
  const [ducks, setDucks] = useState<DuckListType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalDucks: 0,
    totalPages: 0,
    currentPage: 1,
    ducksPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const fetchDucks = async () => {
      try {
        setLoading(true);
        setError(null);

        const sortParam =
          {
            popular: "-likes",
            oldest: "uploadedAt",
            newest: "-uploadedAt",
          }[filter] || "-uploadedAt";

        const params = new URLSearchParams({
          sort: sortParam,
          page: page.toString(),
          limit: "12", // Fixed to 10 per page
        });

        if (filters.breed) params.append("breed", filters.breed);
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.isRubberDuck) params.append("isRubberDuck", "true");

        const response = await fetch(`${API_ENDPOINTS.DUCKS.BASE}?${params}`);
        if (!response.ok) throw new Error("Failed to fetch ducks");

        const data: PaginatedDuckResponse = await response.json();
        setDucks(data.ducks);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching ducks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDucks();
  }, [filter, filters, page]);

  return { ducks, loading, error, setDucks, pagination };
}
