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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      await onSubmit(replyContent);
      setReplyContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 ml-12">
      <div className="flex items-start space-x-2">
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Write your reply..."
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          disabled={isSubmitting}
        />
        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
