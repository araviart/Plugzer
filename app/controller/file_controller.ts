import { Request, Response } from "express";
import { App } from "../type/app";
import multer from "multer";
import { verifyTokenAndGetUser } from "./auth_controller";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../fileStorage')); // Destination folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Rename the file
    }
});

// Initialisation de l'upload
const upload = multer({ storage: storage });

// Compression middleware
async function compressFileOrFolder(req: Request, res: Response, next: Function) {
    if (!req.file) return next(); // Skip if no file

    try {
        const outputDir = path.join(__dirname, '../compressed');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const zipFilePath = path.join(outputDir, `compressed-${Date.now()}.zip`);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`Compression complete, ${archive.pointer()} total bytes`);
            if (req.file) {
                req.file.path = zipFilePath; // Update path to the compressed file
                req.file.filename = path.basename(zipFilePath); // Update filename to the ZIP file
            }
            next();
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // Add file or folder to the archive
        if (req.file) {
            archive.file(req.file.path, { name: req.file.originalname });
        } else {
            const folderPath = path.join(__dirname, '../fileStorage');
            if (fs.existsSync(folderPath)) {
                archive.directory(folderPath, false);
            }
        }

        await archive.finalize();
    } catch (error) {
        console.error("Error during compression:", error);
        res.status(500).json({ message: 'Error during compression' });
    }
}

export async function deleteFile(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then(async (userId) => {
        await app.repository.fileRepository.deleteFile(userId, req.params.id as unknown as number);
        res.json({ message: "Dossier supprimé avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
}

export async function addFile(app: App, req: Request, res: Response): Promise<void> {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).json({ message: 'Erreur lors du traitement du formdata.' });
        }

        compressFileOrFolder(req, res, async () => {
            const token = req.headers.authorization?.split(" ")[1];
            console.log("Token:", token);

            const file = req.file; // Uploaded file
            const path = req.body.path; // `path` field

            console.log("Fichier reçu :", file); // Verify file
            console.log("Chemin reçu :", path); // Verify path

            if (!file) {
                res.status(400).json({ message: "Le fichier est requis." });
                return;
            }

            try {
                const userId = await verifyTokenAndGetUser(token);
                const parentFolderId = path ? await app.repository.folderRepository.getParentFolderIdFromPath(userId, path) : null;

                await app.repository.fileRepository.addFile(userId, file, path ?? null, parentFolderId);

                res.json({ message: "Fichier ajouté avec succès." });
            } catch (error) {
                console.error("Error verifying token or processing file:", error);
                res.status(401).json({ message: error });
            }
        });
    });
}

export async function getFiles(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then(async (userId) => {
        const parentFolderId = req.query.id ? parseInt(req.query.id as string) : null;
        const files = await app.repository.fileRepository.getFiles(userId, parentFolderId);
        res.json(files);
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
}
