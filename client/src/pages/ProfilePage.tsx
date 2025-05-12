// pages/ProfilePage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import DuckCard from "../components/DuckCard";
import { DuckListType, User, DuckType, DuckOptions } from "../@types";
import { useAuth } from "../context/AuthContext";
import DuckManagementModal from "../components/DuckManagmentModal";
import ProfilePictureCropper from "../components/CroppingModal";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userDucks, setUserDucks] = useState<DuckListType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duckOptions, setDuckOptions] = useState<DuckOptions | null>(null);
  const [selectedDuck, setSelectedDuck] = useState<DuckType | null>(null);
  const [showDuckModal, setShowDuckModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"myDucks" | "likedDucks">(
    "myDucks"
  );
  const [likedDucks, setLikedDucks] = useState<DuckListType>([]);
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState("");

  const isCurrentUserProfile = currentUser && id && currentUser.id === id;

  useEffect(() => {
    if (
      isCurrentUserProfile &&
      activeTab === "likedDucks" &&
      !likedDucks.length
    ) {
      const fetchLikedDucks = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await fetch(
            "http://localhost:8000/api/ducks/liked",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch liked ducks");
          }

          const data = await response.json();
          setLikedDucks(data.likedDucks);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load liked ducks"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchLikedDucks();
    }
  }, [activeTab, isCurrentUserProfile, likedDucks.length]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
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
            fetch(`http://localhost:8000/api/user/${id}`, { headers }),
            fetch(`http://localhost:8000/api/ducks/?uploadedBy=${id}`, {
              headers,
            }),
            fetch("http://localhost:8000/api/ducks/options", { headers }),
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

        if (userData.user.bio) {
          setBio(userData.user.bio);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (blob: Blob) => {
    const file = new File([blob], "profile-picture.jpg", {
      type: "image/jpeg",
    });
    setProfilePictureFile(file);

    const preview = URL.createObjectURL(blob);
    setPreviewUrl(preview);
    setShowCropper(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateProfile = async () => {
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

      const response = await fetch(
        `http://localhost:8000/api/user/${id}/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const { user: updatedUser } = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setPreviewUrl(null);
      setProfilePictureFile(null);

      if (isCurrentUserProfile) {
        updateUser({
          profilePicture: updatedUser.profilePicture,
          bio: updatedUser.bio,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    setProfilePictureFile(null);
    if (user?.bio) {
      setBio(user.bio);
    } else {
      setBio("");
    }
  };

  const handleEditDuck = (duck: DuckType) => {
    setSelectedDuck(duck);
    setShowDuckModal(true);
  };

  const handleUpdateDuck = (updatedDuck: DuckType) => {
    setUserDucks((prev) =>
      prev.map((duck) => (duck._id === updatedDuck._id ? updatedDuck : duck))
    );
    setSelectedDuck(null);
    setShowDuckModal(false);
  };

  const handleDeleteDuck = (duckId: string) => {
    setUserDucks((prev) => prev.filter((duck) => duck._id !== duckId));
    setSelectedDuck(null);
    setShowDuckModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-bounce text-6xl">🦆</div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{error}</h3>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Header Background */}
          <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 relative">
            <div className="absolute inset-0 bg-opacity-10 bg-white"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8 relative">
            {/* Profile Picture*/}
            <div className="flex justify-center -mt-20 mb-4">
              <div className="relative group">
                {isCurrentUserProfile && isEditing ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={triggerFileInput}
                      className="w-40 h-40 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden shadow-lg relative"
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover bg-white"
                        />
                      ) : user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover bg-white"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <span className="text-7xl text-blue-300">🦆</span>
                        </div>
                      )}
                      <div className="absolute inset-0  group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                          Change Photo
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover bg-white"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <span className="text-7xl text-blue-300">🦆</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.username}
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Bio Section */}
              {isCurrentUserProfile && isEditing ? (
                <div className="max-w-2xl mx-auto">
                  <label className="block text-gray-700 font-medium mb-2 text-left">
                    About Me
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={4}
                    placeholder="Tell the duck community about yourself..."
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      {bio.length}/500 characters
                    </p>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </div>
              ) : (
                bio && (
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 text-lg">{bio}</p>
                  </div>
                )
              )}

              {/* Edit Controls */}
              <div className="mt-8 flex justify-center gap-4">
                {isCurrentUserProfile && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                )}

                {isCurrentUserProfile && isEditing && (
                  <>
                    <button
                      onClick={cancelEditing}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ducks Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {/* Tab Navigation - Centered */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab("myDucks")}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  activeTab === "myDucks"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isCurrentUserProfile ? "My Ducks" : `${user.username}'s Ducks`}
              </button>
              {isCurrentUserProfile && (
                <button
                  onClick={() => setActiveTab("likedDucks")}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    activeTab === "likedDucks"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Liked Ducks
                </button>
              )}
            </div>
          </div>

          {/* Ducks Grid */}
          {activeTab === "myDucks" || !isCurrentUserProfile ? (
            userDucks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-4">🦆</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {isCurrentUserProfile
                    ? "No ducks uploaded yet!"
                    : `${user.username} hasn't uploaded any ducks yet!`}
                </h3>
                {isCurrentUserProfile && (
                  <button
                    onClick={() => navigate("/ducks")}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Your First Duck
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userDucks.map((duck) => (
                  <div key={duck._id} className="relative group">
                    <DuckCard duck={duck} />
                    {isCurrentUserProfile && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditDuck(duck);
                        }}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Duck"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : likedDucks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-4">🦆</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No liked ducks yet!
              </h3>
              <button
                onClick={() => navigate("/ducks")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Browse Ducks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedDucks.map((duck) => (
                <div key={duck._id}>
                  <DuckCard duck={duck} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Duck Management Modal */}
      {showDuckModal && selectedDuck && duckOptions && (
        <DuckManagementModal
          duck={selectedDuck}
          options={duckOptions}
          onClose={() => {
            setSelectedDuck(null);
            setShowDuckModal(false);
          }}
          onUpdate={handleUpdateDuck}
          onDelete={handleDeleteDuck}
        />
      )}

      {/* Profile Picture Cropper Modal */}
      {showCropper && (
        <ProfilePictureCropper
          src={cropperImage}
          onSave={handleCroppedImage}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}
