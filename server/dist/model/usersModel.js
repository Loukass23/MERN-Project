"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "quack error username already taken"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [12, "Username must be less than 12 characters"],
        match: [
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers and underscores",
        ],
    },
    email: {
        type: String,
        required: [true, "how could you forget the quckmail?"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Duckword is required"],
        minlength: [6, "duckword must be at least 6 characters"],
        select: false, // Prevents password from being returned in queries by default
    },
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/df1np6arc/image/upload/v1748203709/default_jj2hkz.webp",
    },
    profilePicturePublicId: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
        default: "",
        maxlength: [500, "Bio cannot be longer than 500 characters"],
    },
    likedDucks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Duck" }], // Track ducks this user liked
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
