import express from "express";
import {
  createDuck,
  deleteDuck,
  ducks,
  updateDuck,
} from "../controller/duckController";
const duckRouter = express.Router();

duckRouter.get("/", ducks);
duckRouter.post("/", createDuck);
duckRouter.put("/:id", updateDuck);
duckRouter.delete("/:id", deleteDuck);

export default duckRouter;
