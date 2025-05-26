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
exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.encryptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("No JWT secret");
}
// Bcrypt function (password hashing & comparison)
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        const salt = yield bcryptjs_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.log("Error: ", error);
    }
});
exports.encryptPassword = encryptPassword;
const verifyPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isMatch = yield bcryptjs_1.default.compare(password, hashedPassword);
        return isMatch;
    }
    catch (error) {
        console.log("Error: ", error);
    }
});
exports.verifyPassword = verifyPassword;
// JWT functions (token generation & verification)
const generateToken = (userId, userEmail, userName) => {
    const payload = {
        sub: userId,
        email: userEmail,
        username: userName,
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
