import { Request, Response } from "express";
import { App } from "../type/app";
import { verifyTokenAndGetUser } from "./auth_controller";


export async function getUsedStorage(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    console.log('GETTING USED STORAGE')

    verifyTokenAndGetUser(token).then( async (userId) =>{
        console.log("body",req.body)
        const result = await app.repository.userRepository.getUsedStorage(userId);
        res.json(result);
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}