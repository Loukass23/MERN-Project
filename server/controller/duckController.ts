import mongoose from "mongoose";
import Duck from "../model/ducksModel";
import User from "../model/usersModel";
import { Request, Response } from "express";
import {
  DUCK_BREEDS,
  DUCK_GENDERS,
  DUCK_MOODS,
} from "../constants/duckOptions";

export const getDuckOptions = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      options: {
        breeds: DUCK_BREEDS,
        moods: DUCK_MOODS,
        genders: DUCK_GENDERS,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
  return;
};

export const ducks = async (req: Request, res: Response) => {
  try {
    const ducks = await Duck.find({}).sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, ducks: ducks });
  } catch (error) {
    console.log("error in fetching ducks:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createDuck = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const duckData = req.body;

  if (!duckData.name || !duckData.image) {
    res.status(400).json({
      success: false,
      message: "Name and image are required fields",
    });
    return;
  }

  if (duckData.gender && !DUCK_GENDERS.includes(duckData.gender)) {
    res.status(400).json({
      success: false,
      message: "Invalid gender value",
    });
    return;
  }

  const duck = {
    ...duckData,
    likes: 0,
    likedBy: [],
    uploadedAt: new Date(),
    uploadedBy: req.user._id,
    isRubberDuck: duckData.isRubberDuck || false,
  };

  try {
    const newDuck = new Duck(duck);
    await newDuck.save();
    res.status(201).json({ success: true, duck: newDuck });
    return;
  } catch (error) {
    console.log("Error creating duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const updateDuck = async (req: Request, res: Response) => {
  const { id } = req.params;
  const duckData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "Invalid duck ID" });
    return;
  }

  if (duckData.gender && !DUCK_GENDERS.includes(duckData.gender)) {
    res.status(400).json({
      success: false,
      message: "Invalid gender value",
    });
    return;
  }

  try {
    if ("likes" in duckData || "likedBy" in duckData) {
      res.status(400).json({
        success: false,
        message: "you cant cheat!!! quack",
      });
      return;
    }

    const updatedDuck = await Duck.findByIdAndUpdate(id, duckData, {
      new: true,
    });
    if (!updatedDuck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }
    res.status(200).json({ success: true, duck: updatedDuck });
    return;
  } catch (error) {
    console.log("Error updating duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const deleteDuck = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "Invalid duck ID" });
    return;
  }

  try {
    const deletedDuck = await Duck.findByIdAndDelete(id);
    if (!deletedDuck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }

    await User.updateMany({ likedDucks: id }, { $pull: { likedDucks: id } });

    res.status(200).json({
      success: true,
      message: "Duck deleted successfully",
    });
    return;
  } catch (error) {
    console.log("Error deleting duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const likeDuck = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "Invalid duck ID" });
    return;
  }

  try {
    const duck = await Duck.findById(id);
    if (!duck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }

    // Check if user already liked this duck
    const userAlreadyLiked = duck.likedBy.some(
      (userId) => userId.toString() === req.user!._id.toString()
    );

    if (userAlreadyLiked) {
      res.status(400).json({
        success: false,
        message: "You already liked this duck",
      });
      return;
    }

    // Update duck
    const updatedDuck = await Duck.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1 },
        $push: { likedBy: req.user._id },
      },
      { new: true }
    );

    // Update user's liked ducks
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedDucks: id },
    });

    res.status(200).json({
      success: true,
      likes: updatedDuck?.likes,
      liked: true,
    });
    return;
  } catch (error) {
    console.log("Error liking duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const unlikeDuck = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "Invalid duck ID" });
    return;
  }

  try {
    const duck = await Duck.findById(id);
    if (!duck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }

    // Check if user hasn't liked this duck
    const userAlreadyLiked = duck.likedBy.some(
      (userId) => userId.toString() === req.user!._id.toString()
    );

    if (!userAlreadyLiked) {
      res.status(400).json({
        success: false,
        message: "You haven't liked this duck yet",
      });
      return;
    }

    // Update duck
    const updatedDuck = await Duck.findByIdAndUpdate(
      id,
      {
        $inc: { likes: -1 },
        $pull: { likedBy: req.user._id },
      },
      { new: true }
    );

    // Update user's liked ducks
    await User.findByIdAndUpdate(req.user._id, { $pull: { likedDucks: id } });

    res.status(200).json({
      success: true,
      likes: updatedDuck?.likes,
      liked: false,
    });
    return;
  } catch (error) {
    console.log("Error unliking duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const getUserLikedDucks = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  try {
    const user = await User.findById(req.user._id).populate("likedDucks");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, likedDucks: user.likedDucks });
    return;
  } catch (error) {
    console.log("Error fetching liked ducks:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const getDucksByBreed = async (req: Request, res: Response) => {
  const { breed } = req.params;

  try {
    const ducks = await Duck.find({ breed: breed });
    res.status(200).json({ success: true, ducks: ducks });
    return;
  } catch (error) {
    console.log("Error fetching ducks by breed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const checkUserLikes = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  const { duckIds } = req.body;

  if (!Array.isArray(duckIds)) {
    res.status(400).json({
      success: false,
      message: "duckIds should be an array",
    });
    return;
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const likedStatus = duckIds.map((duckId: string) => ({
      duckId,
      liked: user.likedDucks.some((id) => id.toString() === duckId),
    }));

    res.status(200).json({ success: true, likedStatus });
    return;
  } catch (error) {
    console.log("Error checking user likes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
