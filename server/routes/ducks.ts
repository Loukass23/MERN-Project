import express from "express";
import {
  createDuck,
  deleteDuck,
  ducks,
  getDuckOptions,
  getDucksByBreed,
  getUserLikedDucks,
  likeDuck,
  unlikeDuck,
  updateDuck,
} from "../controller/duckController";
import { authMiddleware } from "../middleware/authMiddleware";
const duckRouter = express.Router();

duckRouter.get("/", ducks);
duckRouter.post("/", authMiddleware, createDuck);
duckRouter.put("/:id", updateDuck);
duckRouter.delete("/:id", deleteDuck);
duckRouter.post("/:id/like", authMiddleware, likeDuck);
duckRouter.get("/me/liked", authMiddleware, getUserLikedDucks);
duckRouter.get("/:id/unlike", authMiddleware, unlikeDuck);
duckRouter.get("/breed/:breed", getDucksByBreed);
duckRouter.get("/options", getDuckOptions);

export default duckRouter;
