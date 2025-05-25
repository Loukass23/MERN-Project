import { useState } from "react";
import { motion } from "motion/react";

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

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      setReplyContent(e.target.value);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`mt-3 ml-4 sm:ml-12 transition-all duration-200 ${
        isFocused ? "scale-[1.01]" : ""
      }`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <div className="flex-1 relative w-full">
          <textarea
            value={replyContent}
            onChange={handleReplyChange}
            placeholder="Quack back..."
            className={`w-full min-h-[80px] max-h-[200px] border-2 ${
              isFocused ? "border-blue-400" : "border-blue-200"
            } rounded-2xl p-3 pr-12 focus:ring-2 focus:ring-blue-300 bg-white shadow-sm transition-all resize-y overflow-y-auto`}
            rows={2}
            disabled={isSubmitting}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={300}
          />
          {replyContent.length > 0 && (
            <div
              className={`absolute bottom-3 right-3 text-xs ${
                replyContent.length > 250 ? "text-red-500" : "text-blue-600"
              }`}
            >
              {replyContent.length}/300
              {replyContent.length > 250 && (
                <span className="ml-1">({300 - replyContent.length} left)</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <motion.button
            type="submit"
            disabled={isSubmitting || !replyContent.trim()}
            className={`px-4 py-2 rounded-xl font-medium flex items-center justify-center transition-all ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : replyContent.trim()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md text-white"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
            }`}
            whileHover={
              !isSubmitting && replyContent.trim() ? { scale: 1.02 } : {}
            }
            whileTap={
              !isSubmitting && replyContent.trim() ? { scale: 0.98 } : {}
            }
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
              "Quack"
            )}
          </motion.button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
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
