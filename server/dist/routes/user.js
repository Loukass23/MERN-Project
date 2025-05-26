"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", userController_1.users);
userRouter.get("/me", authMiddleware_1.authMiddleware, userController_1.getCurrentUser);
userRouter.put("/:id/profile", authMiddleware_1.authMiddleware, uploadMiddleware_1.default.single("image"), userController_1.updateProfilePicture);
userRouter.post("/register", userController_1.register);
userRouter.post("/login", userController_1.login);
userRouter.get("/:id", userController_1.getUserById);
exports.default = userRouter;
