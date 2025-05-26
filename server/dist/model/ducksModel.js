"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const duckOptions_1 = require("../constants/duckOptions");
const duckSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    imagePublicId: {
        type: String,
        required: false,
    },
    breed: { type: String, enum: duckOptions_1.DUCK_BREEDS },
    age: { type: Number },
    gender: { type: String, enum: duckOptions_1.DUCK_GENDERS, default: "unknown" },
    description: { type: String },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    mood: { type: String, enum: duckOptions_1.DUCK_MOODS },
    isRubberDuck: { type: Boolean, default: false },
});
const Duck = mongoose_1.default.model("Duck", duckSchema);
exports.default = Duck;
//
//
//
// Possible Leaderboard Categories
// 1. Most Liked Ducks
// Ducks with the most likes
// Encourages users to like each other’s uploads
// 2. Top Quackers
// Ducks with the most comments (or user interaction)
// Can also be “Most Talked About Duck”
// 4. Moodiest Ducks
// Group ducks by their mood value and show the top ones
// e.g., “Top 5 Grumpiest Ducks of the Week”
// 5. Duck of the Day/Week
// A randomly selected duck with a bit of spotlight
// Can be weighted based on likes/comments/etc.
// 6. Veteran Ducks
// Ducks that have been on the site the longest (uploadedAt)
// “Elder Ducks” — wise and old
// 8. Quack Stats
// Show silly stats like:
// “Average Duck Mood: Sleepy”
// “Most Common Duck Name: Steve”
// “% of Ducks Wearing Hats: 12%”
