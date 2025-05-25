import { FormEvent, useState } from "react";
import { motion } from "motion/react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isAuthenticated: boolean;
  showAuthModal: (message: string) => void;
}

export function CommentForm({
  onSubmit,
  isAuthenticated,
  showAuthModal,
}: CommentFormProps) {
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showAuthModal("You need to log in to post a comment!");
      return;
    }

    if (!newComment.trim()) {
      showAuthModal("Comment cannot be empty!");
      return;
    }

    onSubmit(newComment);
    setNewComment("");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      setNewComment(e.target.value);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 relative w-full">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="What's on your mind? Quack about it..."
            className={`w-full min-h-[100px] max-h-[300px] border-2 ${
              isFocused ? "border-blue-400" : "border-blue-200"
            } rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-blue-300 bg-white shadow-sm transition-all text-gray-700 resize-y overflow-y-auto`}
            rows={3}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={300}
          />
          {newComment.length > 0 && (
            <div
              className={`absolute bottom-4 right-4 text-xs ${
                newComment.length > 250 ? "text-red-500" : "text-blue-600"
              }`}
            >
              {newComment.length}/300
              {newComment.length > 250 && (
                <span className="ml-1">({300 - newComment.length} left)</span>
              )}
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!newComment.trim()}
          className={`px-6 py-3 rounded-xl font-medium flex items-center justify-center transition-all ${
            newComment.trim()
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md text-white"
              : "bg-blue-100 text-blue-400 cursor-not-allowed"
          }`}
          whileHover={newComment.trim() ? { scale: 1.02 } : {}}
          whileTap={newComment.trim() ? { scale: 0.98 } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Quack
        </motion.button>
      </div>

      {/* Water ripple effect */}
      {isFocused && (
        <div className="ripple-container mt-2">
          <div className="ripple-dots">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="ripple-dot bg-blue-300"
                animate={{
                  scale: [1, 3],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.form>
  );
}
