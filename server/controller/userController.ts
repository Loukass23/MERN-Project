import { Request, Response } from "express";
import User from "../model/usersModel";
import { encryptPassword, generateToken, verifyPassword } from "../lib/auth";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}
// helper function
const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export const users = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.log("Quack! Error in fetching users:", error);
    res.status(500).json({
      success: false,
      message:
        "The ducks got confused and couldn't fetch the users. Try again later!",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("likedDucks");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      likedDucks: user.likedDucks || [],
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Request body:", req.body);
  }
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || username.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Username is required quck quack",
      });
      return;
    }

    if (!email || email.trim() === "") {
      res.status(400).json({
        success: false,
        message: "duckmail is required",
      });
      return;
    }

    if (!password || password.trim() === "") {
      res.status(400).json({
        success: false,
        message: "duckword is required",
      });
      return;
    }

    // Check for existing user by username or email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400).json({
        message: "Quack! This email is already in our pond. Try another one!",
      });
      return;
    }

    // Then check for username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400).json({
        message:
          "Quack! This username is already taken by another duck in our pond!",
      });
      return;
    }

    // Validators
    if (password.length < 6) {
      res.status(400).json({
        message:
          "Quack! Your duckword is too short - it needs at least 6 characters to keep your nest safe!",
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      res.status(400).json({
        message:
          "Quack! Your username can only contain letters, numbers, and underscores - no funny duck symbols allowed!",
      });
      return;
    }

    if (username.length < 3 || username.length > 12) {
      res.status(400).json({
        message:
          "Quack! Your username must be between 3-12 characters - not too short, not too long, just ducky!",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Quack! That doesn't look like a proper duckmail address!",
      });
      return;
    }

    const hashedPassword = await encryptPassword(password);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const userId = user._id.toString();
    const token = generateToken(userId, user.email, user.username);

    res.status(201).json({
      message: "Quack-tastic! You've successfully joined our duck pond!",
      token,
      user: {
        id: user._id,
        // _id: user._id,
        username,
        email,
      },
    });
  } catch (error: any) {
    console.error("Quack! Registration error:", error);
  }
};

export const login = async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Request body:", req.body);
  }

  try {
    const { login, password } = req.body;

    // validation
    if (!login || login.trim() === "") {
      res.status(400).json({
        success: false,
        message: "duckmail or username is required",
      });
      return;
    }

    if (!password || password.trim() === "") {
      res.status(400).json({
        success: false,
        message: "duckword is required",
      });
      return;
    }

    // Determine if login is email or username
    const isEmail = login.includes("@");
    const query = isEmail ? { email: login } : { username: login };

    const user = await User.findOne(query).select("+password");

    if (!user) {
      res.status(401).json({
        message: isEmail
          ? "Quack! No duck found with that email in our pond!"
          : "Quack! No duck found with that username in our pond!",
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "Quack! Wrong duckword - are you sure you're the right duck?",
      });
      return;
    }

    const userId = user._id.toString();
    const token = generateToken(userId, user.email, user.username);

    res.status(200).json({
      message: "Quack! Welcome back to the pond!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Quack! Login error:", error);

    if (error instanceof mongoose.Error) {
      res.status(400).json({
        message: "Quack! There's something wrong with your request!",
      });
      return;
    }

    res.status(500).json({
      message:
        "Oh no! The ducks got their feathers in a twist. Try again later!",
    });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verify the user is updating their own profile
    if (!req.user || req.user._id.toString() !== id) {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Initialize update object
    const updates: any = {};

    // Handle bio update
    if (req.body.bio !== undefined) {
      updates.bio = req.body.bio;
    }

    // Handle image update if new file was uploaded
    if (req.file) {
      // Upload new image
      const { secure_url, public_id } = await uploadToCloudinary(
        req.file.path,
        "profile-pictures"
      );

      // Delete old image if it exists
      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      // Update image fields
      updates.profilePicture = secure_url;
      updates.profilePicturePublicId = public_id;

      // Clean up temp file
      fs.unlinkSync(req.file.path);
    }

    // Apply updates
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

