import { Request, Response } from "express";
import Comment from "../model/commentsModel";
import Duck from "../model/ducksModel";

export const createComment = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { duckId } = req.params;
  const { content, parentCommentId } = req.body;

  if (!content) {
    res
      .status(400)
      .json({ success: false, message: "Comment content is required" });
    return;
  }

  try {
    // Check if duck exists
    const duck = await Duck.findById(duckId);
    if (!duck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }

    // Check if parent comment exists if provided
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        res
          .status(404)
          .json({ success: false, message: "Parent comment not found" });
        return;
      }
    }

    const comment = new Comment({
      content,
      duck: duckId,
      user: req.user._id,
      parentComment: parentCommentId || null,
    });

    await comment.save();

    // If this is a reply, add it to the parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    // Populate user info for the response
    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "username profilePicture"
    );

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCommentsForDuck = async (req: Request, res: Response) => {
  const { duckId } = req.params;

  try {
    // Step 1: Fetch top-level comments (no parent) as plain JS objects
    const comments = await Comment.find({ duck: duckId, parentComment: null })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")
      .lean(); // Convert to plain JS objects

    // Step 2: Recursive function to populate replies
    const populateReplies = async (comment: any) => {
      if (!comment.replies || comment.replies.length === 0) return comment;

      // Populate replies (convert to plain objects)
      const populatedReplies = await Comment.find({
        _id: { $in: comment.replies },
      })
        .sort({ createdAt: -1 }) // <-- Sort replies by newest first
        .populate("user", "username profilePicture")
        .lean();

      // Recursively populate nested replies
      for (const reply of populatedReplies) {
        await populateReplies(reply);
      }

      comment.replies = populatedReplies;
      return comment;
    };

    // Step 3: Populate replies for each top-level comment
    for (const comment of comments) {
      await populateReplies(comment);
    }

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    res
      .status(400)
      .json({ success: false, message: "Comment content is required" });
    return;
  }

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: req.user._id },
      { content },
      { new: true }
    ).populate("user", "username profilePicture");

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found or not authorized",
      });
      return;
    }

    res.status(200).json({ success: true, comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { commentId } = req.params;

  try {
    // Find the comment first to check ownership
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    // Check if the current user is the owner of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
      return;
    }

    // If this is a parent comment, delete all replies first
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // If this is a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    // Finally, delete the comment itself
    await comment.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    // Check if user already liked this comment
    const alreadyLiked = comment.likedBy.some(
      (userId) => userId.toString() === req.user!._id.toString()
    );

    if (alreadyLiked) {
      res.status(400).json({
        success: false,
        message: "You already liked this comment",
      });
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: { likes: 1 },
        $push: { likedBy: req.user._id },
      },
      { new: true }
    ).populate("user", "username profilePicture");

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const unlikeComment = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    // Check if user hasn't liked this comment
    const alreadyLiked = comment.likedBy.some(
      (userId) => userId.toString() === req.user!._id.toString()
    );

    if (!alreadyLiked) {
      res.status(400).json({
        success: false,
        message: "You haven't liked this comment yet",
      });
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $inc: { likes: -1 },
        $pull: { likedBy: req.user._id },
      },
      { new: true }
    ).populate("user", "username profilePicture");

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error unliking comment:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
