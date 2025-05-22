interface BioEditorProps {
  bio: string;
  isEditing: boolean;
  isCurrentUserProfile: boolean;
  onBioChange: (bio: string) => void;
}

export function BioEditor({
  bio,
  isEditing,
  isCurrentUserProfile,
  onBioChange,
}: BioEditorProps) {
  if (isCurrentUserProfile && isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <label className="block text-gray-700 font-medium mb-2 text-left">
          About Me
        </label>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={4}
          placeholder="Tell the duck community about yourself..."
          maxLength={500}
        />
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-500">{bio.length}/500 characters</p>
        </div>
      </div>
    );
  }

  return bio ? (
    <div className="max-w-2xl mx-auto">
      <p className="text-gray-700 text-lg">{bio}</p>
    </div>
  ) : null;
}
