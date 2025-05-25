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
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/df1np6arc/image/upload/v1748203709/default_jj2hkz.webp",
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
    likedDucks: [{ type: Schema.Types.ObjectId, ref: "Duck" }], // Track ducks this user liked
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
