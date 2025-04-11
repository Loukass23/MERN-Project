import Duck from "../model/ducksModel";
import { Request, Response } from "express";

export const getAllDucks = async (req: Request, res: Response) => {
  try {
    const ducks = await Duck.find({});
    if (ducks) {
      //    res.send(ducks)
      res.status(200).json({
        message: "this are all your ducks",
        number: ducks.length,
        ducks,
      });
    } else res.send({ error: "No ducks found" });
  } catch (err: any) {
    res.send({ error: err.message });
  }
};

// export const ducks = async (req: Request, res: Response) => {
//   try {
//     const ducks = await Duck.find({});
//     res.status(200).json({ success: true, data: ducks });
//   } catch (error) {
//     console.log("error in fetching ducks:");
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// export const createDuck = async (req: Request, res: Response) => {
//   const duck = req.body;

//   if (!duck.name || !duck.image) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide all Ducky information",
//     });
//   }

//   const newDuck = new Duck(duck);

//   try {
//     await newDuck.save();
//     res.status(201).json({ success: true, data: newDuck });
//   } catch (error) {
//     console.log("There was an error while crateting your cute ducky");
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
