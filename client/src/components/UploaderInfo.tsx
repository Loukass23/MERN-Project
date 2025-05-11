import { useEffect, useState } from "react";
import { Link } from "react-router";

interface UploaderInfoProps {
  uploadedBy: string | null;
  className?: string;
}

export function UploaderInfo({
  uploadedBy,
  className = "",
}: UploaderInfoProps) {
  const [uploaderUsername, setUploaderUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploader = async () => {
      try {
        if (uploadedBy) {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8000/api/user/${uploadedBy}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.user?.username) {
              setUploaderUsername(data.user.username);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching uploader:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploader();
  }, [uploadedBy]);

  if (loading) {
    return (
      <div
        className={`h-4 w-3/4 bg-gray-200 rounded animate-pulse ${className}`}
      ></div>
    );
  }

  if (!uploadedBy || !uploaderUsername) {
    return (
      <div className={`text-sm text-gray-400 ${className}`}>
        Uploader unknown
      </div>
    );
  }

  return (
    <div className={`text-sm ${className}`}>
      <span className="text-gray-500">Uploaded by </span>
      <Link
        to={`/profile/${uploadedBy}`}
        onClick={(e) => e.stopPropagation()}
        className="text-blue-600 hover:underline font-medium"
      >
        {uploaderUsername}
      </Link>
    </div>
  );
}
