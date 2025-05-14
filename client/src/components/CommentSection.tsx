import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FunnyModal } from "./FunnyModal";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorDisplay } from "./ErrorDisplay";
import { CommentItem } from "./CommentItem";
import { ReplyForm } from "./ReplyForm";

interface CommentType {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  likes: number;
  likedBy: string[];
  createdAt: string;
  replies: CommentType[];
}

interface CommentSectionProps {
  duckId: string;
}

export function CommentSection({ duckId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `http://localhost:8000/api/comments/${duckId}`
        );
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data.comments);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load comments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [duckId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setModalMessage("You need to log in to post a comment!");
      setShowModal(true);
      return;
    }

    if (!newComment.trim()) {
      setModalMessage("Comment cannot be empty!");
      setShowModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/comments/${duckId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newComment,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      const data = await response.json();
      setComments((prevComments) => [data.comment, ...prevComments]);
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  const handleReplySubmit = async (
    parentCommentId: string,
    content: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/comments/${duckId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            parentCommentId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to post reply");

      const data = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentCommentId) {
            return {
              ...comment,
              replies: [...comment.replies, data.comment],
            };
          }
          return comment;
        })
      );
      setReplyingTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    }
  };

  const handleEditSubmit = async (commentId: string, newContent: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to update comment");

      // Update the comment in state
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // Check main comments
          if (comment._id === commentId) {
            return {
              ...comment,
              content: newContent,
            };
          }
          // Check replies
          if (comment.replies.some((reply) => reply._id === commentId)) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply._id === commentId) {
                  return {
                    ...reply,
                    content: newContent,
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );
      setEditingComment(null);
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleLike = async (commentId: string, isCurrentlyLiked: boolean) => {
    if (!isAuthenticated) {
      setModalMessage("You need to log in to like comments!");
      setShowModal(true);
      return;
    }

    if (
      user &&
      comments.some(
        (c) =>
          (c._id === commentId && c.user._id === user.id) ||
          c.replies.some((r) => r._id === commentId && r.user._id === user.id)
      )
    ) {
      setModalMessage("You can't like your own comment!");
      setShowModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const endpoint = isCurrentlyLiked ? "unlike" : "like";
      const response = await fetch(
        `http://localhost:8000/api/comments/${commentId}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to like comment");

      // Update the comment in state
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // Check main comments
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1,
              likedBy: isCurrentlyLiked
                ? comment.likedBy.filter((id) => id !== user?.id)
                : [...comment.likedBy, user?.id || ""],
            };
          }
          // Check replies
          if (comment.replies.some((reply) => reply._id === commentId)) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply._id === commentId) {
                  return {
                    ...reply,
                    likes: isCurrentlyLiked ? reply.likes - 1 : reply.likes + 1,
                    likedBy: isCurrentlyLiked
                      ? reply.likedBy.filter((id) => id !== user?.id)
                      : [...reply.likedBy, user?.id || ""],
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment");

      // Remove the comment from state
      setComments((prevComments) => {
        // First check if it's a top-level comment
        const commentIndex = prevComments.findIndex((c) => c._id === commentId);
        if (commentIndex !== -1) {
          return prevComments.filter((_, index) => index !== commentIndex);
        }

        // If not, it's a reply - find and remove it from its parent
        return prevComments.map((comment) => ({
          ...comment,
          replies: comment.replies.filter((reply) => reply._id !== commentId),
        }));
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return <LoadingIndicator text="Loading comments..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Quack Talk</h2>

      {/* Comment form */}
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

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">
            No comments yet. Be the first to quack!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id}>
              <CommentItem
                comment={comment}
                onLike={handleLike}
                onReply={setReplyingTo}
                onDelete={handleDelete}
                onEdit={handleEditSubmit}
                currentUserId={user?.id}
              />

              {/* Reply form */}
              {replyingTo === comment._id && (
                <ReplyForm
                  onSubmit={(content) =>
                    handleReplySubmit(comment._id, content)
                  }
                  onCancel={() => setReplyingTo(null)}
                />
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 mt-2 pl-4 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id}>
                      <CommentItem
                        comment={reply}
                        onLike={handleLike}
                        onDelete={handleDelete}
                        onEdit={handleEditSubmit}
                        currentUserId={user?.id}
                        isReply
                        // Removed onReply for replies since they can't have nested replies //need to fix
                      />
                      {/* Reply form appears when replying to this reply */}
                      {replyingTo === reply._id && (
                        <ReplyForm
                          onSubmit={(content) =>
                            handleReplySubmit(comment._id, content)
                          }
                          onCancel={() => setReplyingTo(null)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <FunnyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        playQuack={true}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">
            🦆 <span className="text-yellow-500">Quack Alert!</span> 🦆
          </p>
          <p className="text-sm text-gray-600">{modalMessage}</p>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 px-4 py-1 rounded-full bg-yellow-400 text-white text-sm hover:bg-yellow-300 transition-colors"
          >
            Okay!
          </button>
        </div>
      </FunnyModal>
    </div>
  );
}
