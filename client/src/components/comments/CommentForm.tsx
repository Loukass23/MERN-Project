import { FormEvent, useState } from "react";

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

  return (
    <form onSubmit={handleSubmit} className="mb-6 relative">
      {/* Duck decoration */}
      <div className="absolute -left-10 top-3">
        <div className="relative"></div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What's on your mind? Quack about it..."
            className={`w-full border-2 ${
              isFocused ? "border-yellow-400" : "border-yellow-200"
            } rounded-xl p-4 pr-10 focus:ring-2 focus:ring-yellow-300 bg-white shadow-sm transition-all text-gray-700`}
            rows={3}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={300}
          />
          {/* Character counter */}
          {newComment.length > 0 && (
            <div
              className={`absolute bottom-3 right-3 text-xs ${
                newComment.length > 250 ? "text-red-400" : "text-yellow-600"
              }`}
            >
              {newComment.length}/300
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!newComment.trim()}
          className={`px-5 py-3 rounded-xl font-medium flex items-center transition-all ${
            newComment.trim()
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-md text-white"
              : "bg-yellow-100 text-yellow-400 cursor-not-allowed"
          }`}
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
        </button>
      </div>

      {/* Water ripple effect decoration */}
      {isFocused && (
        <div className="ripple-container">
          <div className="ripple-dots">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="ripple-dot" />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
