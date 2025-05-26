"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controller/commentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const commentRouter = express_1.default.Router();
commentRouter.post("/:duckId", authMiddleware_1.authMiddleware, commentController_1.createComment);
commentRouter.get("/:duckId", commentController_1.getCommentsForDuck);
commentRouter.put("/:commentId", authMiddleware_1.authMiddleware, commentController_1.updateComment);
commentRouter.delete("/:commentId", authMiddleware_1.authMiddleware, commentController_1.deleteComment);
commentRouter.post("/:commentId/like", authMiddleware_1.authMiddleware, commentController_1.likeComment);
commentRouter.post("/:commentId/unlike", authMiddleware_1.authMiddleware, commentController_1.unlikeComment);
exports.default = commentRouter;
