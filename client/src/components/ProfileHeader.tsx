import { User } from "../@types";
import { ProfilePictureEditor } from "./ProfilePictureEditor";
import { BioEditor } from "./BioEditor";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: User;
  isCurrentUserProfile: boolean;
  isEditing: boolean;
  bio: string;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (bio: string) => void;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function ProfileHeader({
  user,
  isCurrentUserProfile,
  isEditing,
  bio,
  previewUrl,
  onFileChange,
  onBioChange,
  onEditToggle,
  onSave,
  onCancel,
  loading,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 relative">
      {/* Wave Background Header */}
      <div className="h-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-400/10"></div>
        <div className="wave-background absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-8 relative">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-20 mb-4">
          <ProfilePictureEditor
            user={user}
            isCurrentUserProfile={isCurrentUserProfile}
            isEditing={isEditing}
            previewUrl={previewUrl}
            onFileChange={onFileChange}
          />
        </div>

        {/* Profile Info */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {user.username}
              </motion.h1>
              <motion.p
                className="text-sm text-gray-400 mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </motion.p>
            </div>
          </div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <BioEditor
              bio={bio}
              isEditing={isEditing}
              isCurrentUserProfile={isCurrentUserProfile}
              onBioChange={onBioChange}
              username={user.username}
            />
          </motion.div>

          {/* Edit Controls */}
          {isCurrentUserProfile && (
            <motion.div
              className="mt-8 flex justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {!isEditing ? (
                <button
                  onClick={onEditToggle}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
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
              ) : (
                <>
                  <button
                    onClick={onCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSave}
                    disabled={loading}
                    className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
