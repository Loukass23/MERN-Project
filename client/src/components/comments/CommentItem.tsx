import { useState } from "react";
import { Link } from "react-router";
import { CommentType } from "../../@types";
import { motion } from "motion/react";

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

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 300) {
      setEditedContent(e.target.value);
    }
  };

  return (
    <motion.div
      className={`bg-white p-5 rounded-2xl shadow-md ${
        isReply ? "border-l-4 border-blue-300 ml-4 sm:ml-8" : ""
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <Link
          to={`/profile/${comment.user._id}`}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={comment.user.profilePicture || "/default-profile.png"}
            alt={comment.user.username}
            className="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <Link
                to={`/profile/${comment.user._id}`}
                className="font-semibold text-blue-800 hover:underline flex items-center"
              >
                {comment.user.username}
              </Link>
              <span className="text-xs text-gray-500 ml-1">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(comment._id)}
                  className="text-xs text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-full"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-3">
              <textarea
                value={editedContent}
                onChange={handleEditChange}
                className="w-full min-h-[100px] border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-300 resize-y"
                rows={3}
                maxLength={300}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  {editedContent.length}/300
                  {editedContent.length > 250 && (
                    <span className="text-red-500 ml-1">
                      ({300 - editedContent.length} left)
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editedContent.trim()}
                    className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-700 whitespace-pre-wrap break-words overflow-hidden">
                {comment.content}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                isLiked
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full flex items-center"
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
    </motion.div>
  );
}
