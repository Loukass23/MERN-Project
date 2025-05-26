import { useEffect, useState } from "react";
import { useComments } from "../hooks/useComments";
import { useAuth } from "../../context/AuthContext";
import { LoadingIndicator } from "../LoadingIndicator";
import { ErrorDisplay } from "../ErrorDisplay";
import { CommentForm } from "./CommentForm";
import { CommentTree } from "./CommentTree";
import { FunnyModal } from "../FunnyModal";
import { CommentType } from "../../@types";
import { API_ENDPOINTS } from "../../config/api";
import { motion } from "motion/react";

interface CommentSectionProps {
  duckId: string;
}

export function CommentSection({ duckId }: CommentSectionProps) {
  const {
    comments,
    setComments,
    addComment,
    addReply,
    updateCommentTree,
    removeCommentFromTree,
  } = useComments();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { isAuthenticated, user } = useAuth();

  // Generic API request function
  const makeRequest = async (
    endpoint: string,
    method: string,
    body?: object,
    headers?: Record<string, string>
  ) => {
    const token = localStorage.getItem("token");
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    };

    const response = await fetch(endpoint, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  // Fetch comments on when clicking on duckdet
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await makeRequest(
          API_ENDPOINTS.COMMENTS.DUCK_COMMENTS(duckId),
          "GET"
        );
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
  }, [duckId, setComments]);

  // Check authentication
  const checkAuth = (action: string): boolean => {
    if (!isAuthenticated) {
      setModalMessage(`You need to log in to ${action}!`);
      setShowModal(true);
      return false;
    }
    return true;
  };

  // Handle new comment submission
  const handleSubmit = async (content: string) => {
    if (!checkAuth("post a comment")) return;

    try {
      const data = await makeRequest(
        API_ENDPOINTS.COMMENTS.DUCK_COMMENTS(duckId),
        "POST",
        {
          content,
        }
      );
      addComment(data.comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (
    parentCommentId: string,
    content: string
  ): Promise<void> => {
    if (!checkAuth("reply to comments")) return;

    try {
      const data = await makeRequest(
        API_ENDPOINTS.COMMENTS.DUCK_COMMENTS(duckId),
        "POST",
        {
          content,
          parentCommentId,
        }
      );
      addReply(parentCommentId, data.comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
      throw err;
    }
  };

  // Handle comment edit
  const handleEditSubmit = async (commentId: string, newContent: string) => {
    try {
      await makeRequest(API_ENDPOINTS.COMMENTS.COMMENT(commentId), "PUT", {
        content: newContent,
      });

      setComments((prev) =>
        updateCommentTree(prev, commentId, (comment) => ({
          ...comment,
          content: newContent,
        }))
      );
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  // Handle comment like/unlike
  const handleLike = async (commentId: string, isCurrentlyLiked: boolean) => {
    if (!checkAuth("like comments")) return;
    if (!user) return;

    // Check if user owns the comment
    const isOwnedByUser = (
      comments: CommentType[],
      targetId: string
    ): boolean =>
      comments.some((comment) => {
        if (comment._id === targetId && comment.user._id === user.id) {
          return true;
        }
        return comment.replies?.length
          ? isOwnedByUser(comment.replies, targetId)
          : false;
      });

    if (isOwnedByUser(comments, commentId)) {
      setModalMessage("You can't like your own comment!");
      setShowModal(true);
      return;
    }

    try {
      const endpoint = isCurrentlyLiked
        ? API_ENDPOINTS.COMMENTS.UNLIKE(commentId)
        : API_ENDPOINTS.COMMENTS.LIKE(commentId);
      await makeRequest(endpoint, "POST");

      setComments((prev) =>
        updateCommentTree(prev, commentId, (comment) => ({
          ...comment,
          likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: isCurrentlyLiked
            ? comment.likedBy.filter((id) => id !== user.id)
            : [...comment.likedBy, user.id],
        }))
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      await makeRequest(API_ENDPOINTS.COMMENTS.COMMENT(commentId), "DELETE");
      setComments((prev) => removeCommentFromTree(prev, commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) return <LoadingIndicator text="Loading comments..." />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <motion.div
      className="mt-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
        <span className="mr-2">Quack Talk</span>
        <span className="text-blue-400">🦆</span>
      </h2>

      <CommentForm
        onSubmit={handleSubmit}
        isAuthenticated={isAuthenticated}
        showAuthModal={(msg) => {
          setModalMessage(msg);
          setShowModal(true);
        }}
      />

      <div className="space-y-4 mt-6">
        {comments.length === 0 ? (
          <motion.div
            className="text-center py-6 bg-blue-50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600 font-medium">
              No comments yet. Be the first to quack!
            </p>
          </motion.div>
        ) : (
          comments.map((comment) => (
            <CommentTree
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReplySubmit}
              onDelete={handleDelete}
              onEdit={handleEditSubmit}
              currentUserId={user?.id}
              isAuthenticated={isAuthenticated}
              showAuthModal={(msg) => {
                setModalMessage(msg);
                setShowModal(true);
              }}
            />
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
            🦆 <span className="text-blue-500">Quack Alert!</span> 🦆
          </p>
          <p className="text-sm text-gray-600">{modalMessage}</p>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            Okay!
          </button>
        </div>
      </FunnyModal>
    </motion.div>
  );
}
