import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
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
    passwordChangedAt: Date, // For tracking password changes
    passwordResetToken: String, // For password reset functionality
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
