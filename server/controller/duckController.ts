import Duck from "../model/ducksModal";
import { Request, Response } from "express";


export const getAllDucks = async (req:Request, res:Response) => {
    try {
        const ducks = await Duck.find({});
        if (ducks) {
            return res.send(ducks)
        } 

            return res.send({ error: "No ducks found" })
        
    } catch (err: any) { //change any later to real error msg
        return res.send({ error: err.message })
    }
};
