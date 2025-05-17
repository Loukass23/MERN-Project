import { useState } from "react";
import { ReplyForm } from "./ReplyForm";
import { CommentItem } from "./CommentItem";
import { CommentType } from "../../@types";

interface CommentTreeProps {
  comment: CommentType;
  depth?: number;
  onLike: (commentId: string, isLiked: boolean) => void;
  onReply: (parentCommentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => Promise<void>;
  currentUserId?: string;
  isAuthenticated: boolean;
  showAuthModal: (message: string) => void;
}

export function CommentTree({
  comment,
  depth = 0,
  onLike,
  onReply,
  onDelete,
  onEdit,
  currentUserId,
  isAuthenticated,
  showAuthModal,
}: CommentTreeProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // Changed to false to collapse by default

  const handleReplySubmit = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onReply(comment._id, content);
      setReplyingTo(null);
      setShowReplies(true); // Automatically show replies after submitting a new one
    } catch (error) {
      // Error handled in CommentSection
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const hasReplies = comment.replies?.length > 0;

  return (
    <div
      className={depth > 0 ? "ml-8 mt-2 pl-4 border-l-2 border-gray-200" : ""}
    >
      <CommentItem
        comment={comment}
        onLike={onLike}
        onReply={setReplyingTo}
        onDelete={onDelete}
        onEdit={onEdit}
        currentUserId={currentUserId}
        isAuthenticated={isAuthenticated}
        showAuthModal={showAuthModal}
        isReply={depth > 0}
      />

      {replyingTo === comment._id && (
        <ReplyForm
          onSubmit={handleReplySubmit}
          onCancel={() => setReplyingTo(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {hasReplies && (
        <button
          onClick={toggleReplies}
          className="ml-12 mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 flex items-center focus:outline-none bg-yellow-100 px-3 py-1 rounded-full transition-all"
          aria-expanded={showReplies}
          aria-controls={`replies-${comment._id}`}
        >
          {showReplies ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 transform rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Hide quacks
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
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Show quacks ({comment.replies.length})
            </>
          )}
        </button>
      )}

      {showReplies && hasReplies && (
        <div id={`replies-${comment._id}`} className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentTree
              key={reply._id}
              comment={reply}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit}
              currentUserId={currentUserId}
              isAuthenticated={isAuthenticated}
              showAuthModal={showAuthModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
