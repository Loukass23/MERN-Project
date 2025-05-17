import { useEffect, useState } from "react";
import { useComments } from "../hooks/useComments";
import { useAuth } from "../../context/AuthContext";
import { LoadingIndicator } from "../LoadingIndicator";
import { ErrorDisplay } from "../ErrorDisplay";
import { CommentForm } from "./CommentForm";
import { CommentTree } from "./CommentTree";
import { FunnyModal } from "../FunnyModal";
import { CommentType } from "../../@types";

const API_BASE_URL = "http://localhost:8000/api/comments";

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
    url: string,
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

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  };

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await makeRequest(`${API_BASE_URL}/${duckId}`, "GET");
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

  // Check authentication helper
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
      const data = await makeRequest(`${API_BASE_URL}/${duckId}`, "POST", {
        content,
      });
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
      const data = await makeRequest(`${API_BASE_URL}/${duckId}`, "POST", {
        content,
        parentCommentId,
      });
      addReply(parentCommentId, data.comment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
      throw err; // re-throw the error so CommentTree can handle it
    }
  };

  // Handle comment edit
  const handleEditSubmit = async (commentId: string, newContent: string) => {
    try {
      await makeRequest(`${API_BASE_URL}/${commentId}`, "PUT", {
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
      const endpoint = isCurrentlyLiked ? "unlike" : "like";
      await makeRequest(`${API_BASE_URL}/${commentId}/${endpoint}`, "POST");

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
      await makeRequest(`${API_BASE_URL}/${commentId}`, "DELETE");
      setComments((prev) => removeCommentFromTree(prev, commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) return <LoadingIndicator text="Loading comments..." />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="mt-8 max-w-4xl mx-auto bg-gradient-to-b from-yellow-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
      <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center">
        <span className="mr-2">Quack Talk</span>
      </h2>

      <CommentForm
        onSubmit={handleSubmit}
        isAuthenticated={isAuthenticated}
        showAuthModal={(msg) => {
          setModalMessage(msg);
          setShowModal(true);
        }}
      />

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6">
            <div className="inline-block bg-yellow-100 p-4 rounded-full mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              No comments yet. Be the first to quack!
            </p>
          </div>
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
