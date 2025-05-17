import { useState } from "react";
import { Link } from "react-router";
import { CommentType } from "../../@types";

interface CommentItemProps {
  comment: CommentType;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onReply?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, newContent: string) => Promise<void>;
  currentUserId?: string;
  isAuthenticated?: boolean;
  showAuthModal?: (message: string) => void;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  onLike,
  onReply,
  onDelete,
  onEdit,
  currentUserId,
  isAuthenticated = false,
  showAuthModal,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const isLiked = currentUserId
    ? comment.likedBy.includes(currentUserId)
    : false;
  const isOwner = currentUserId === comment.user._id;

  const handleSaveEdit = async () => {
    if (!onEdit) return;
    try {
      await onEdit(comment._id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  };

  const handleReplyClick = () => {
    if (!isAuthenticated && showAuthModal) {
      showAuthModal("You need to log in to reply to comments!");
      return;
    }
    onReply?.(comment._id);
  };

  const handleLikeClick = () => {
    if (!isAuthenticated && showAuthModal) {
      showAuthModal("You need to log in to like comments!");
      return;
    }
    onLike?.(comment._id, isLiked);
  };

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-sm ${
        isReply ? "border-l-4 border-yellow-300" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <Link
          to={`/profile/${comment.user._id}`}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={comment.user.profilePicture || "/default-profile.png"}
            alt={comment.user.username}
            className="h-12 w-12 rounded-full object-cover border-2 border-yellow-300"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/profile/${comment.user._id}`}
                className="font-semibold text-blue-800 hover:underline flex items-center"
              >
                {comment.user.username}
              </Link>
              <span className="ml-2 text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            {isOwner && (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(comment._id)}
                  className="text-xs text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border-2 border-yellow-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-300"
                rows={3}
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700">{comment.content}</p>
          )}

          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={handleLikeClick}
              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-lg ${
                isLiked
                  ? "bg-red-50 text-red-500"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={handleReplyClick}
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
