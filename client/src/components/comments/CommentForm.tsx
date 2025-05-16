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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-start space-x-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post
        </button>
      </div>
    </form>
  );
}
