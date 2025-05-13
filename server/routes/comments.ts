import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsForDuck,
  likeComment,
  unlikeComment,
  updateComment,
} from "../controller/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const commentRouter = express.Router();

commentRouter.post("/:duckId", authMiddleware, createComment);
commentRouter.get("/:duckId", getCommentsForDuck);
commentRouter.put("/:commentId", authMiddleware, updateComment);
commentRouter.delete("/:commentId", authMiddleware, deleteComment);
commentRouter.post("/:commentId/like", authMiddleware, likeComment);
commentRouter.post("/:commentId/unlike", authMiddleware, unlikeComment);

export default commentRouter;
