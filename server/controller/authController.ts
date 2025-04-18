import { Request, Response } from "express";
import User from "../model/usersModel";
import { encryptPassword, generateToken, verifyPassword } from "../lib/auth";

export const register = async (req: Request, res: Response) => {
  console.log("Body:", req.body);

  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email }); //need to add more maybe
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    console.log("password", password);
    const hashedPassword = await encryptPassword(password);
    console.log("hashedPassword", hashedPassword);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const userId = user._id.toString();
    const token = generateToken(userId, user.email);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username, email },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const userId = user._id.toString();
    const token = generateToken(userId, user.email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
