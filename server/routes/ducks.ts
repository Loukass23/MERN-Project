import express from "express";
import {
  checkUserLikes,
  createDuck,
  deleteDuck,
  ducks,
  getDuckById,
  getDuckOptions,
  getUserLikedDucks,
  likeDuck,
  unlikeDuck,
  updateDuck,
} from "../controller/duckController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
const duckRouter = express.Router();

duckRouter.get("/", ducks);
duckRouter.get("/options", getDuckOptions);
duckRouter.get("/liked", authMiddleware, getUserLikedDucks);
duckRouter.post("/check-likes", authMiddleware, checkUserLikes); //idk need to fix!
duckRouter.get("/:id", getDuckById);
duckRouter.post("/", authMiddleware, upload.single("image"), createDuck);
duckRouter.put("/:id", authMiddleware, upload.single("image"), updateDuck);
duckRouter.delete("/:id", authMiddleware, deleteDuck);
duckRouter.post("/:id/like", authMiddleware, likeDuck);
duckRouter.post("/:id/unlike", authMiddleware, unlikeDuck);

export default duckRouter;
