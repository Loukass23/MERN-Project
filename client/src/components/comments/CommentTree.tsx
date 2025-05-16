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

  const handleReplySubmit = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onReply(comment._id, content);
      setReplyingTo(null);
    } catch (error) {
      // Error  handled in CommentSection
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {comment.replies?.length > 0 && (
        <div className="space-y-3">
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
