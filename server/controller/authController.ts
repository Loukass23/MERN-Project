import { Request, Response } from "express";
import User from "../model/usersModel";








export const register = async (req: Request, res: Response) => {
    try {
        console.log('req.body :>> ', req.body);
        const { username, email, password } = req.body;
        const exsistingUser = await UserActivation.findOne({ email });
        if (exsistingUser) {
            res.status(400).json({ message: "user already in use" });
            return;
        }
    
    
    const hashedPassword = await encryptPassword(password)

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const userId = user._id.toString()
    const token = generateToken(userId, user.email)
    res.status(201).json({
        message: "user registered successfully", token, user: { id: userId }
    });
    } catch (error: any) {
    res.status(500).json({ message: "error my g" });
}