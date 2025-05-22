import { useEffect, useState } from "react";
import { DuckListType } from "../../@types";
import { API_ENDPOINTS } from "../../config/api";

export function useLikedDucks(
  isCurrentUserProfile: boolean,
  activeTab: string
) {
  const [likedDucks, setLikedDucks] = useState<DuckListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedDucks = async () => {
      if (activeTab !== "likedDucks" || !isCurrentUserProfile) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_ENDPOINTS.DUCKS.LIKED, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch liked ducks");

        const data = await response.json();
        setLikedDucks(data.likedDucks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading ducks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedDucks();
  }, [isCurrentUserProfile, activeTab]);

  return { likedDucks, isLoading, error };
}
