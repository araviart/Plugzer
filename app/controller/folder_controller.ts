import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { App } from "../type/app";
import { verifyTokenAndGetUser } from "./auth_controller";

const JWT_SECRET = "secretkeyg";

/* 
CREATE TABLE dossier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    dossier_parent_id INT, -- ID du dossier parent (facultatif)
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (dossier_parent_id) REFERENCES dossier(id) ON DELETE SET NULL
);
*/

export async function addFolder(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        console.log(req.body)
        await app.repository.folderRepository.addFolder(userId, req.body.folderName, req.body.path??null);
        res.json({ message: "Dossier créé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}

export async function getFolders(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);
    console.log("req.params.path", req.params.path??null);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        const folders = await app.repository.folderRepository.getFolders(userId, req.params.path??null);
        const parentFolderId = req.params.path ? await app.repository.folderRepository.getParentFolderIdFromPath(userId, req.params.path) : null;
        const files = await app.repository.fileRepository.getFiles(userId, parentFolderId);
         // Combine folders and files into a single array and sort by lastOpenedAt
         const elements = [...folders, ...files].sort((a, b) => {
            const dateA = new Date(a.lastOpenedAt).getTime();
            const dateB = new Date(b.lastOpenedAt).getTime();
            return dateB - dateA; // Tri décroissant (plus récent en premier)
        });

        console.log("elements")

        console.log(elements);

        res.json(elements);
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}