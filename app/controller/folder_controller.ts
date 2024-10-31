import { Request, Response } from "express";
import { App } from "../type/app";
import { verifyTokenAndGetUser } from "./auth_controller";


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
    console.log("req.params.path", req.query.path??null);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        const folders = await app.repository.folderRepository.getFolders(userId, req.query.path as string ?? null);
        const parentFolderId = req.query.path ? await app.repository.folderRepository.getParentFolderIdFromPath(userId, req.query.path as string) : null;
        const files = await app.repository.fileRepository.getFiles(userId, parentFolderId);
         // Combine folders and files into a single array and sort by lastOpenedAt
         const elements = [...folders, ...files].sort((a, b) => {
            const dateA = new Date(a.lastOpenedAt).getTime();
            const dateB = new Date(b.lastOpenedAt).getTime();
            return dateB - dateA; // Tri décroissant (plus récent en premier)
        });

       // console.log("elements")

        // console.log(elements);

        res.json(elements);
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}

export async function deleteFolder(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        const force = req.body.force as boolean ?? false;
        
        await app.repository.folderRepository.deleteFolder(userId, req.params.id as unknown as number, force, app.repository.fileRepository);

        res.json({ message: "Dossier supprimé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}

export async function renameFolder(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then( async (userId) =>{
        await app.repository.folderRepository.updateFolder(userId, req.params.id as unknown as number, req.body.folderName as string);
        res.json({ message: "Dossier renommé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}