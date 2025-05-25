import { motion } from "framer-motion";

interface BioEditorProps {
  bio: string;
  isEditing: boolean;
  isCurrentUserProfile: boolean;
  onBioChange: (bio: string) => void;
  username: string;
}

export function BioEditor({
  bio,
  isEditing,
  isCurrentUserProfile,
  onBioChange,
  username,
}: BioEditorProps) {
  if (isCurrentUserProfile && isEditing) {
    return (
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2 text-left">
            About {username}
          </label>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            rows={4}
            placeholder={`Tell the duck community about ${username}...`}
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 bg-white px-2 rounded-full">
            <span className="text-xs text-gray-500">{bio.length}/500</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return bio ? (
    <motion.div
      className="max-w-2xl mx-auto bg-blue-50 rounded-xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="text-blue-800 font-medium mb-2">About {username}</h3>
      <p className="text-gray-700 whitespace-pre-line">{bio}</p>
    </motion.div>
  ) : isCurrentUserProfile ? (
    <motion.div
      className="max-w-2xl mx-auto bg-blue-50 rounded-xl p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <p className="text-gray-500 italic">
        Add a bio to let others know more about {username}!
      </p>
    </motion.div>
  ) : null;
}
