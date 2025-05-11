import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  login,
  register,
  updateProfilePicture,
  users,
} from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const userRouter: Router = Router();

userRouter.get("/", users);

userRouter.get("/me", authMiddleware, getCurrentUser);

userRouter.put(
  "/:id/profile",
  authMiddleware,
  upload.single("image"),
  updateProfilePicture
);

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/:id", getUserById);

export default userRouter;
