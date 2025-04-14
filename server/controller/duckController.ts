import mongoose from "mongoose";
import Duck from "../model/ducksModel";
import { Request, Response } from "express";

// export const getAllDucks = async (req: Request, res: Response) => {
//   try {
//     const ducks = await Duck.find({});
//     if (ducks) {
//       //    res.send(ducks)
//       res.status(200).json({
//         message: "this are all your ducks",
//         number: ducks.length,
//         ducks,
//       });
//     } else res.send({ error: "No ducks found" });
//   } catch (err: any) {
//     res.send({ error: err.message });
//   }
// };

export const ducks = async (req: Request, res: Response) => {
  try {
    const ducks = await Duck.find({});
    res.status(200).json({ success: true, data: ducks });
  } catch (error) {
    console.log("error in fetching ducks:");
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createDuck = async (req: Request, res: Response) => {
  const duck = req.body;

  if (!duck.name || !duck.image) {
    res.status(400).json({
      success: false,
      message: "Please provide all Ducky information",
    });
  }

  try {
    const newDuck = new Duck(duck);
    await newDuck.save();
    res.status(201).json({ success: true, data: newDuck });
  } catch (error) {
    console.log("There was an error while creating your cute ducky");
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateDuck = async (req: Request, res: Response) => {
  const { id } = req.params;
  const duck = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "invalid ducky id" });
  }

  try {
    const updatedDuck = await Duck.findByIdAndUpdate(id, duck, { new: true });
    res.status(200).json({ success: true, data: updatedDuck });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const deleteDuck = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ success: false, message: "invalid ducky id" });
  }

  try {
    await Duck.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "duck deleted ;( why would you do that?",
    });
  } catch (error) {
    console.log("error in deleting ducky");
    res.status(500).json({ success: false, message: "server error" });
  }
};
