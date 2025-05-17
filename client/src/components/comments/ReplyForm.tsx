import { useState } from "react";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReplyForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      await onSubmit(replyContent);
      setReplyContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-3 ml-12 transition-all duration-200 ${
        isFocused ? "scale-[1.01]" : ""
      }`}
    >
      <div className="relative">
        <div className="flex items-start space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Quack back..."
              className={`w-full border-2 ${
                isFocused ? "border-yellow-400" : "border-yellow-200"
              } rounded-xl p-3 pr-10 focus:ring-2 focus:ring-yellow-300 bg-white shadow-sm transition-all`}
              rows={2}
              disabled={isSubmitting}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={300}
            />
            {/* Character counter */}
            {replyContent.length > 0 && (
              <div
                className={`absolute bottom-2 right-2 text-xs ${
                  replyContent.length > 250 ? "text-red-400" : "text-yellow-600"
                }`}
              >
                {replyContent.length}/300
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className={`px-4 py-2 rounded-xl font-medium flex items-center justify-center transition-all ${
                isSubmitting
                  ? "bg-yellow-300 cursor-not-allowed"
                  : replyContent.trim()
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-md"
                  : "bg-yellow-100 text-yellow-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Quacking...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-yellow-200 text-yellow-600 rounded-xl hover:bg-yellow-50 transition-colors flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel
            </button>
          </div>
        </div>
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
