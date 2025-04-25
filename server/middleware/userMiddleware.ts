import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";
import User from "../model/usersModel";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // TODO if not verified insult user

    // Find user by id //
    const user = await User.findById(decoded?.sub).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Add user to request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const authMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // TODO if not verified insult user

    // Find user by id //
    const user = await User.findById(decoded?.sub).select("-password");

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
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
