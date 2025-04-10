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
    //change any later to real error msg
    res.send({ error: err.message });
  }
};
