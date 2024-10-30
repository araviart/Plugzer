import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { App } from "../type/app";

export function getAll(app: App) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.body.user?.id;

            if (!userId) {
                res.status(400).json({ error: "ID utilisateur manquant dans la requête." });
                return;
            }

            const files = await app.repository.fileRepository.getFiles({ id: userId });
            res.json({
                message: "Liste des fichiers de l'utilisateur",
                data: files
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des fichiers:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    };
}  
