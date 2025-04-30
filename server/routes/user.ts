import { Router } from "express";
import { login, register, users } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter: Router = Router();

userRouter.get("/", users);

userRouter.post("/register", register);

userRouter.post("/login", login);

export default userRouter;
