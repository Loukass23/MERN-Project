// components/CommentItem.tsx
import { useState } from "react";
import { Link } from "react-router";

interface CommentItemProps {
  comment: {
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
  };
  onLike: (commentId: string, isLiked: boolean) => void;
  onReply?: (commentId: string) => void; // Made optional
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => Promise<void>;
  currentUserId?: string;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  onLike,
  onReply,
  onDelete,
  onEdit,
  currentUserId,
  isReply = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const isLiked = currentUserId
    ? comment.likedBy.includes(currentUserId)
    : false;
  const isOwner = currentUserId === comment.user._id;

  const handleSaveEdit = async () => {
    await onEdit(comment._id, editedContent);
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-gray-50 p-4 rounded-lg ${isReply ? "bg-gray-100" : ""}`}
    >
      <div className="flex items-start space-x-3">
        <Link
          to={`/profile/${comment.user._id}`}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={comment.user.profilePicture || "/default-profile.png"}
            alt={comment.user.username}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/profile/${comment.user._id}`}
                className="font-semibold text-blue-800 hover:underline"
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
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-xs text-red-500 hover:text-red-700"
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
                className="w-full border border-gray-300 rounded-lg p-2"
                rows={3}
              />
              <div className="mt-2 space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700">{comment.content}</p>
          )}

          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={() => onLike(comment._id, isLiked)}
              className={`flex items-center space-x-1 text-sm ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            {onReply && (
              <button
                onClick={() => onReply(comment._id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
