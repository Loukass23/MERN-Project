import express from "express";
import Duck from "../model/ducksModal";
import { getAllDucks } from "../controller/duckController";
const router = express.Router();


router.get("/all", getAllDucks)
export default router;