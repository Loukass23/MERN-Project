import { Request, Response } from "express";
import User from "../model/usersModel";
import { encryptPassword, generateToken, verifyPassword } from "../lib/auth";
import mongoose from "mongoose";

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

export const register = async (req: Request, res: Response) => {
  console.log("Request body:", req.body);

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
    const token = generateToken(userId, user.email);

    res.status(201).json({
      message: "Quack-tastic! You've successfully joined our duck pond!",
      token,
      user: {
        id: user._id,
        username,
        email,
      },
    });
  } catch (error: any) {
    console.error("Quack! Registration error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({
        message: "Quack! There's something wrong with your nest:",
        details: messages,
      });
      return;
    }

    if (error.code === 11000) {
      res.status(400).json({
        message: "Quack! This email or username is already in our pond!",
      });
      return;
    }

    res.status(500).json({
      message:
        "Oh no! The ducks messed up something in the pond. Try again later!",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("Login endpoint hit");
  console.log("Request body:", req.body);

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
    const token = generateToken(userId, user.email);

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
