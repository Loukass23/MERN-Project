"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeComment = exports.likeComment = exports.deleteComment = exports.updateComment = exports.getCommentsForDuck = exports.createComment = void 0;
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const ducksModel_1 = __importDefault(require("../model/ducksModel"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const duck = yield ducksModel_1.default.findById(duckId);
        if (!duck) {
            res.status(404).json({ success: false, message: "Duck not found" });
            return;
        }
        // Check if parent comment exists if provided
        if (parentCommentId) {
            const parentComment = yield commentsModel_1.default.findById(parentCommentId);
            if (!parentComment) {
                res
                    .status(404)
                    .json({ success: false, message: "Parent comment not found" });
                return;
            }
        }
        const comment = new commentsModel_1.default({
            content,
            duck: duckId,
            user: req.user._id,
            parentComment: parentCommentId || null,
        });
        yield comment.save();
        // If this is a reply, add it to the parent comment's replies
        if (parentCommentId) {
            yield commentsModel_1.default.findByIdAndUpdate(parentCommentId, {
                $push: { replies: comment._id },
            });
        }
        // Populate user info for the response
        const populatedComment = yield commentsModel_1.default.findById(comment._id).populate("user", "username profilePicture");
        res.status(201).json({ success: true, comment: populatedComment });
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.createComment = createComment;
const getCommentsForDuck = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { duckId } = req.params;
    try {
        // Step 1: Fetch top-level comments (no parent) as plain JS objects
        const comments = yield commentsModel_1.default.find({ duck: duckId, parentComment: null })
            .sort({ createdAt: -1 })
            .populate("user", "username profilePicture")
            .lean(); // Convert to plain JS objects
        // Step 2: Recursive function to populate replies
        const populateReplies = (comment) => __awaiter(void 0, void 0, void 0, function* () {
            if (!comment.replies || comment.replies.length === 0)
                return comment;
            // Populate replies (convert to plain objects)
            const populatedReplies = yield commentsModel_1.default.find({
                _id: { $in: comment.replies },
            })
                .sort({ createdAt: -1 }) // <-- Sort replies by newest first
                .populate("user", "username profilePicture")
                .lean();
            // Recursively populate nested replies
            for (const reply of populatedReplies) {
                yield populateReplies(reply);
            }
            comment.replies = populatedReplies;
            return comment;
        });
        // Step 3: Populate replies for each top-level comment
        for (const comment of comments) {
            yield populateReplies(comment);
        }
        res.status(200).json({ success: true, comments });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.getCommentsForDuck = getCommentsForDuck;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const comment = yield commentsModel_1.default.findOneAndUpdate({ _id: commentId, user: req.user._id }, { content }, { new: true }).populate("user", "username profilePicture");
        if (!comment) {
            res.status(404).json({
                success: false,
                message: "Comment not found or not authorized",
            });
            return;
        }
        res.status(200).json({ success: true, comment });
    }
    catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    const { commentId } = req.params;
    try {
        // Find the comment first to check ownership
        const comment = yield commentsModel_1.default.findById(commentId);
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
            yield commentsModel_1.default.deleteMany({ _id: { $in: comment.replies } });
        }
        // If this is a reply, remove it from parent's replies array
        if (comment.parentComment) {
            yield commentsModel_1.default.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id },
            });
        }
        // Finally, delete the comment itself
        yield comment.deleteOne();
        res
            .status(200)
            .json({ success: true, message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.deleteComment = deleteComment;
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    const { commentId } = req.params;
    try {
        const comment = yield commentsModel_1.default.findById(commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: "Comment not found" });
            return;
        }
        // Check if user already liked this comment
        const alreadyLiked = comment.likedBy.some((userId) => userId.toString() === req.user._id.toString());
        if (alreadyLiked) {
            res.status(400).json({
                success: false,
                message: "You already liked this comment",
            });
            return;
        }
        const updatedComment = yield commentsModel_1.default.findByIdAndUpdate(commentId, {
            $inc: { likes: 1 },
            $push: { likedBy: req.user._id },
        }, { new: true }).populate("user", "username profilePicture");
        res.status(200).json({
            success: true,
            comment: updatedComment,
        });
    }
    catch (error) {
        console.error("Error liking comment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.likeComment = likeComment;
const unlikeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Not authenticated" });
        return;
    }
    const { commentId } = req.params;
    try {
        const comment = yield commentsModel_1.default.findById(commentId);
        if (!comment) {
            res.status(404).json({ success: false, message: "Comment not found" });
            return;
        }
        // Check if user hasn't liked this comment
        const alreadyLiked = comment.likedBy.some((userId) => userId.toString() === req.user._id.toString());
        if (!alreadyLiked) {
            res.status(400).json({
                success: false,
                message: "You haven't liked this comment yet",
            });
            return;
        }
        const updatedComment = yield commentsModel_1.default.findByIdAndUpdate(commentId, {
            $inc: { likes: -1 },
            $pull: { likedBy: req.user._id },
        }, { new: true }).populate("user", "username profilePicture");
        res.status(200).json({
            success: true,
            comment: updatedComment,
        });
    }
    catch (error) {
        console.error("Error unliking comment:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
exports.unlikeComment = unlikeComment;
