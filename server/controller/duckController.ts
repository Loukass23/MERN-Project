import mongoose from "mongoose";
import Duck from "../model/ducksModel";
import User from "../model/usersModel";

import fs from "fs";
import { Request, Response } from "express";
import {
  DUCK_BREEDS,
  DUCK_GENDERS,
  DUCK_MOODS,
} from "../constants/duckOptions";
import { pictureUpload } from "../utils/cloudinaryUpload";
import { pictureDelete } from "../utils/cloudinaryDelete";

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

// export const ducks = async (req: Request, res: Response) => {
//   try {
//     // Extract query parameters
//     const {
//       sort = "-uploadedAt",
//       breed,
//       gender,
//       isRubberDuck,
//       uploadedBy,
//     } = req.query;

//     // Build the filter object
//     const filter: any = {};

//     if (breed) filter.breed = breed;
//     if (gender) filter.gender = gender;
//     if (isRubberDuck) filter.isRubberDuck = isRubberDuck === "true";
//     if (uploadedBy) filter.uploadedBy = uploadedBy;

//     // Fetch ducks with filters and sorting
//     const ducks = await Duck.find(filter).sort(sort as string);

//     res.status(200).json({ success: true, ducks });
//   } catch (error) {
//     console.error("Error fetching ducks:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

export const ducks = async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const {
      sort = "-uploadedAt",
      breed,
      gender,
      isRubberDuck,
      uploadedBy,
      page = 1,
      limit = 12,
    } = req.query;

    // Build the filter object
    const filter: any = {};

    if (breed) filter.breed = breed;
    if (gender) filter.gender = gender;
    if (isRubberDuck) filter.isRubberDuck = isRubberDuck === "true";
    if (uploadedBy) filter.uploadedBy = uploadedBy;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get total count of ducks (for pagination info)
    const totalDucks = await Duck.countDocuments(filter);

    // Fetch ducks with filters, sorting, and pagination
    const ducks = await Duck.find(filter)
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      ducks,
      pagination: {
        totalDucks,
        totalPages: Math.ceil(totalDucks / limitNum),
        currentPage: pageNum,
        ducksPerPage: limitNum,
        hasNextPage: pageNum * limitNum < totalDucks,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching ducks:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDuckById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ success: false, message: "Invalid duck ID" });
      return;
    }

    const duck = await Duck.findById(id);
    if (!duck) {
      res.status(404).json({ success: false, message: "Duck not found" });
      return;
    }

    res.status(200).json({ success: true, duck });
  } catch (error) {
    console.error("Error fetching duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createDuck = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, message: "No image provided" });
    return;
  }

  const duckData = req.body;
  const tempFilePath = req.file.path;

  // Validate required fields
  const errors: string[] = [];

  if (!duckData.name?.trim()) {
    errors.push("Name is a required field");
  }

  if (!duckData.gender || !DUCK_GENDERS.includes(duckData.gender)) {
    errors.push(
      `You need to select a valid gender. Options: ${DUCK_GENDERS.join(", ")}`
    );
  }

  if (!duckData.breed || !DUCK_BREEDS.includes(duckData.breed)) {
    errors.push(
      `You need to select a valid breed. Options: ${DUCK_BREEDS.join(", ")}`
    );
  }

  if (errors.length > 0) {
    // Clean up temp file if validation fails
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });
    res.status(400).json({
      success: false,
      message: errors.join(". "),
    });
    return;
  }

  try {
    // First upload to Cloudinary
    const { secure_url, public_id } = await pictureUpload(
      tempFilePath,
      "ducks"
    );

    // Create new duck with the actual image data
    const duck = new Duck({
      ...duckData,
      image: secure_url,
      imagePublicId: public_id,
      likes: 0,
      likedBy: [],
      uploadedAt: new Date(),
      uploadedBy: req.user._id,
      isRubberDuck: duckData.isRubberDuck || false,
      description: duckData.description || "",
    });

    await duck.save();

    // Clean up temp file
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(201).json({ success: true, duck });
  } catch (error) {
    console.error("Error creating duck:", error);

    // Clean up temp file in case of error
    if (tempFilePath) {
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

export const updateDuck = async (req: Request, res: Response) => {
  const { id } = req.params;
  const tempFilePath = req.file?.path; // Store for cleanup

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

    // Ownership check
    if (
      !duck.uploadedBy ||
      req.user?._id.toString() !== duck.uploadedBy.toString()
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to modify this duck",
      });
      return;
    }

    // First validate all data before any Cloudinary operations
    if (req.body.name) duck.name = req.body.name;
    if (req.body.gender) duck.gender = req.body.gender;
    if (req.body.breed) duck.breed = req.body.breed;
    if (req.body.description !== undefined)
      duck.description = req.body.description;
    if (req.body.isRubberDuck !== undefined) {
      duck.isRubberDuck = req.body.isRubberDuck === "true";
    }

    // Validate before any Cloudinary operations
    await duck.validate();

    // Handle image update only after validation passes
    if (req.file) {
      // Upload new image to Cloudinary
      const { secure_url, public_id } = await pictureUpload(
        tempFilePath!,
        "ducks"
      );

      // Delete old image from Cloudinary if it exists
      if (duck.imagePublicId) {
        try {
          await pictureDelete(duck.imagePublicId);
        } catch (err) {
          console.warn("Failed to delete old image from Cloudinary:", err);
        }
      }

      // Update duck with new image
      duck.image = secure_url;
      duck.imagePublicId = public_id;

      // Delete local temp file
      fs.unlink(tempFilePath!, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    // Save changes
    await duck.save();

    res.status(200).json({ success: true, duck });
  } catch (error) {
    console.error("Error updating duck:", error);

    // Cleanup temp file in case of error
    if (tempFilePath) {
      fs.unlink(tempFilePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    // Handle validation errors specifically
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

export const deleteDuck = async (req: Request, res: Response) => {
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

    // Ownership check
    if (
      !duck.uploadedBy ||
      req.user?._id.toString() !== duck.uploadedBy.toString()
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this duck",
      });
      return;
    }

    // Delete image from Cloudinary if it exists
    if (duck.imagePublicId) {
      await pictureDelete(duck.imagePublicId);
    }

    await duck.deleteOne();
    await User.updateMany({ likedDucks: id }, { $pull: { likedDucks: id } });

    res.status(200).json({
      success: true,
      message: "Duck deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting duck:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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

    // Add this check to prevent liking own duck
    if (
      duck.uploadedBy &&
      duck.uploadedBy.toString() === req.user._id.toString()
    ) {
      res.status(400).json({
        success: false,
        message: "You can't like your own duck",
      });
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
