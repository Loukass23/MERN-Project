import { useState, useEffect } from "react";
import { User } from "../../@types";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

export function useProfileEditing(user: User | null) {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user]);

  const handleUpdateProfile = async (
    id: string,
    profilePictureFile: File | null
  ) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      if (profilePictureFile) {
        formData.append("image", profilePictureFile);
      }
      if (bio !== undefined) {
        formData.append("bio", bio);
      }

      const response = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE(id), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const { user: updatedUser } = await response.json();
      setIsEditing(false);
      setPreviewUrl(null);

      updateUser({
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
      });

      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    if (user?.bio) {
      setBio(user.bio);
    } else {
      setBio("");
    }
  };

  return {
    isEditing,
    setIsEditing,
    bio,
    setBio,
    previewUrl,
    error,
    setError,
    loading,
    handleUpdateProfile,
    cancelEditing,
  };
}
