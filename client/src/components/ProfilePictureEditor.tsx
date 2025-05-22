import { useRef } from "react";
import { User } from "../@types";

interface ProfilePictureEditorProps {
  user: User;
  isCurrentUserProfile: boolean;
  isEditing: boolean;
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePictureEditor({
  user,
  isCurrentUserProfile,
  isEditing,
  previewUrl,
  onFileChange,
}: ProfilePictureEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      {isCurrentUserProfile && isEditing ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
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
            <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
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
  );
}
