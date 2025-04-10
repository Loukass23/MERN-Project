import express from "express";
import { getAllDucks } from "../controller/duckController";
const duckRouter = express.Router();

duckRouter.get("/all", getAllDucks);
export default duckRouter;
