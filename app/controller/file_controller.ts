import { Request, Response } from "express";
import { App } from "../type/app";
import { verifyTokenAndGetUser } from "./auth_controller";


export async function deleteFile(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        
        await app.repository.fileRepository.deleteFile(userId, req.params.id as unknown as number);

        res.json({ message: "Dossier supprimé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}