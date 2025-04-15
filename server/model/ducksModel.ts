import mongoose from "mongoose";

// type DuckType = {
//   id: number;
//   name: string;
//   image: string;
// };

const duckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female", "unknown"] },
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  mood: { type: String },
  isRubberDuck: { type: Boolean, default: false },
});
// const Duck = mongoose.model<DuckType>("Duck", duckSchema);
const Duck = mongoose.model("Duck", duckSchema);
export default Duck;
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
