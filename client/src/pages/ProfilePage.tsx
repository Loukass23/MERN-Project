import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { DuckType } from "../@types";
import { useAuth } from "../context/AuthContext";
import DuckManagementModal from "../components/DuckManagmentModal";
import ProfilePictureCropper from "../components/CroppingModal";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileTabs } from "../components/ProfileTabs";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useProfileData } from "../components/hooks/useProfileData";
import { useLikedDucks } from "../components/hooks/useLikedDucks";
import { useProfileEditing } from "../components/hooks/useProfileEditing";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [showDuckModal, setShowDuckModal] = useState(false);
  const [selectedDuck, setSelectedDuck] = useState<DuckType | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );

  const [activeTab, setActiveTab] = useState<"myDucks" | "likedDucks">(
    "myDucks"
  );

  const {
    user,
    userDucks,
    loading: profileLoading,
    error,
    duckOptions,
    setUser,
    setUserDucks,
  } = useProfileData();

  const isCurrentUserProfile = Boolean(
    currentUser && id && currentUser.id === id
  );

  const { likedDucks, isLoading: likedDucksLoading } = useLikedDucks(
    isCurrentUserProfile,
    activeTab
  );

  const {
    isEditing,
    setIsEditing,
    bio,
    setBio,
    error: editError,
    handleUpdateProfile,
    cancelEditing,
    setError,
    loading: updateLoading,
  } = useProfileEditing(user);

  if (!id) {
    navigate("/");
    return null;
  }

  const handleCroppedImage = (blob: Blob) => {
    const file = new File([blob], "profile-picture.jpg", {
      type: "image/jpeg",
    });
    setProfilePictureFile(file);
    setShowCropper(false);
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

  const handleProfileUpdate = async () => {
    if (!id) return;
    try {
      const updatedUser = await handleUpdateProfile(id, profilePictureFile);
      if (updatedUser) {
        setUser(updatedUser);
        setProfilePictureFile(null);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (editError) setError("");
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <LoadingIndicator text="Loading your profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <ErrorDisplay
          error={error}
          showBackLink={true}
          className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-4"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pt-8 pb-12 overflow-hidden relative">
      {/* Wave Background */}
      <div className="wave-background">
        <div className="wave-deep-layer"></div>
        <motion.div
          className="wave-layer-1"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-2"
          animate={{ backgroundPositionX: ["100%", "0%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="wave-layer-3"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto pt-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader
            user={user}
            isCurrentUserProfile={isCurrentUserProfile}
            isEditing={isEditing}
            bio={bio}
            previewUrl={
              profilePictureFile
                ? URL.createObjectURL(profilePictureFile)
                : null
            }
            onFileChange={handleFileInputChange}
            onBioChange={setBio}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleProfileUpdate}
            onCancel={() => {
              cancelEditing();
              setProfilePictureFile(null);
            }}
            loading={updateLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProfileTabs
            userDucks={userDucks}
            likedDucks={likedDucks}
            user={user}
            isCurrentUserProfile={isCurrentUserProfile}
            onEditDuck={handleEditDuck}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoading={likedDucksLoading}
          />
        </motion.div>
      </div>

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
