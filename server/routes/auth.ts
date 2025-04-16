import { Router } from "express";

const authRouter: Router = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

export default authRouter;
