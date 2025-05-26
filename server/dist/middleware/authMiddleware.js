"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMe = exports.authMiddleware = void 0;
const auth_1 = require("../lib/auth");
const usersModel_1 = __importDefault(require("../model/usersModel"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
            return;
        }
        // Verify token
        const decoded = (0, auth_1.verifyToken)(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.sub)) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        // Find user by id //
        const user = yield usersModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.sub).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
});
exports.authMiddleware = authMiddleware;
const authMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.params.userId;
        // Get token from header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "No token, authorization denied" });
            return;
        }
        // Verify token
        const decoded = (0, auth_1.verifyToken)(token);
        // TODO if not verified insult user
        // Find user by id //
        const user = yield usersModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.sub).select("-password");
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        if (user._id.toString() !== userId) {
            res.status(401).json({ message: "That s not your profile" });
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
});
exports.authMe = authMe;
