import { useState } from "react";
import { CommentType } from "../../@types";

export function useComments(initialComments: CommentType[] = []) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const updateCommentTree = (
    comments: CommentType[],
    targetId: string,
    updateFn: (comment: CommentType) => CommentType
  ): CommentType[] => {
    return comments.map((comment) => {
      if (comment._id === targetId) {
        return updateFn(comment);
      }
      if (comment.replies?.length) {
        return {
          ...comment,
          replies: updateCommentTree(comment.replies, targetId, updateFn),
        };
      }
      return comment;
    });
  };

  const removeCommentFromTree = (
    comments: CommentType[],
    targetId: string
  ): CommentType[] => {
    return comments
      .filter((comment) => comment._id !== targetId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies?.length
          ? removeCommentFromTree(comment.replies, targetId)
          : [],
      }));
  };

  const addComment = (newComment: CommentType) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const addReply = (parentId: string, newReply: CommentType) => {
    setComments((prev) =>
      updateCommentTree(prev, parentId, (comment) => ({
        ...comment,
        replies: [...comment.replies, newReply],
      }))
    );
  };

  return {
    comments,
    setComments,
    addComment,
    addReply,
    updateCommentTree,
    removeCommentFromTree,
  };
}
