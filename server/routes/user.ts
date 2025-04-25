import { Router } from "express";
import { login, register, users } from "../controller/userController";
import { authMiddleware } from "../middleware/userMiddleware";

const userRouter: Router = Router();

userRouter.get("/", authMiddleware, users);

userRouter.post("/register", register);

userRouter.post("/login", login);

export default userRouter;
