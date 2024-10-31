import { Request, Response } from "express";
import { App } from "../type/app";
import multer from "multer";
import { verifyTokenAndGetUser } from "./auth_controller";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../fileStorage')); // Chemin vers le dossier de destination
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Renommer le fichier
    }
});

// Initialisation de l'upload
const upload = multer({ storage: storage });


export async function deleteFile(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then(async (userId) => {
        await app.repository.fileRepository.deleteFile(userId, req.params.id as unknown as number);
        res.json({ message: "Dossier supprimé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
        return;
    });
}

export async function addFile(app: App, req: Request, res: Response): Promise<void> {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).json({ message: 'Erreur lors du traitement du formdata.' });
        }

        const token = req.headers.authorization?.split(" ")[1];
        console.log("Token:", token);

        const file = req.file; // Le fichier téléchargé
        const path = req.body.path; // Le champ `path`

        console.log("Fichier reçu :", file); // Vérifie le fichier
        console.log("Chemin reçu :", path); // Vérifie le chemin

        if (!file) {
            res.status(400).json({ message: "Le fichier est requis." });
            return;
        }

        // Vérification si le chemin est effectivement défini
        if (typeof path === 'undefined') {
            console.error("Le champ 'path' est undefined");
            return res.status(400).json({ message: "Le champ 'path' est requis." });
        }

        try {
            const userId = await verifyTokenAndGetUser(token);
            // Additional processing logic here...

            const parentFolderId = path ? await app.repository.folderRepository.getParentFolderIdFromPath(userId, path) : null;
            
            app.repository.fileRepository.addFile(userId, file, path, parentFolderId, file.filename);

            res.json({ message: "Fichier ajouté avec succès." });
        } catch (error) {
            console.error("Error verifying token or processing file:", error);
            res.status(401).json({ message: error });
        }
    });
}
