import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { DuckListType, DuckOptions, User } from "../../@types";
import { API_ENDPOINTS } from "../../config/api";

export function useProfileData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userDucks, setUserDucks] = useState<DuckListType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [duckOptions, setDuckOptions] = useState<DuckOptions | null>(null);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const [userResponse, ducksResponse, optionsResponse] =
          await Promise.all([
            fetch(API_ENDPOINTS.AUTH.PROFILE(id), { headers }),
            fetch(API_ENDPOINTS.DUCKS.BY_USER(id), { headers }),
            fetch(API_ENDPOINTS.DUCKS.OPTIONS, { headers }),
          ]);

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            throw new Error("Unauthorized access");
          }
          throw new Error("User not found");
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        const ducksData = await ducksResponse.json();
        setUserDucks(ducksData.ducks);

        const optionsData = await optionsResponse.json();
        setDuckOptions(optionsData.options);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  return {
    user,
    userDucks,
    loading,
    error,
    duckOptions,
    setUser,
    setUserDucks,
  };
}
