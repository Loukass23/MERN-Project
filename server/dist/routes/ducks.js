"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const duckController_1 = require("../controller/duckController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const duckRouter = express_1.default.Router();
duckRouter.get("/", duckController_1.ducks);
duckRouter.get("/options", duckController_1.getDuckOptions);
duckRouter.get("/liked", authMiddleware_1.authMiddleware, duckController_1.getUserLikedDucks);
duckRouter.post("/check-likes", authMiddleware_1.authMiddleware, duckController_1.checkUserLikes); //idk need to fix!
duckRouter.get("/:id", duckController_1.getDuckById);
duckRouter.post("/", authMiddleware_1.authMiddleware, uploadMiddleware_1.default.single("image"), duckController_1.createDuck);
duckRouter.put("/:id", authMiddleware_1.authMiddleware, uploadMiddleware_1.default.single("image"), duckController_1.updateDuck);
duckRouter.delete("/:id", authMiddleware_1.authMiddleware, duckController_1.deleteDuck);
duckRouter.post("/:id/like", authMiddleware_1.authMiddleware, duckController_1.likeDuck);
duckRouter.post("/:id/unlike", authMiddleware_1.authMiddleware, duckController_1.unlikeDuck);
exports.default = duckRouter;
