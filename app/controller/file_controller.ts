import { Request, Response } from "express";
import { App } from "../type/app";
import multer from "multer";
import { verifyTokenAndGetUser } from "./auth_controller";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FileLink } from "type/file";
import crypto from "crypto";
//@ts-ignore
import pdf from 'pdf-poppler';
import sharp from 'sharp';


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

        try {
            const userId = await verifyTokenAndGetUser(token);
            // Additional processing logic here...

            const parentFolderId = path ? await app.repository.folderRepository.getParentFolderIdFromPath(userId, path) : null;

            app.repository.fileRepository.addFile(userId, file, path ?? null, parentFolderId);

            res.json({ message: "Fichier ajouté avec succès." });
        } catch (error) {
            console.error("Error verifying token or processing file:", error);
            res.status(401).json({ message: error });
        }
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

// Génère un lien temporaire pour accéder à un fichier
export async function generateTemporarLink(fileId: string, userId: number, app: App): Promise<FileLink> {
    const fileNameInStorage = await app.repository.fileRepository.getFileNameInStorage(fileId);

    if (!fileNameInStorage) {
        throw new Error('Fichier introuvable');
    }

    // Crée un token unique
    const token = crypto.randomBytes(16).toString("hex");
    const expiration = Date.now() + 24 * 60 * 60 * 1000; // Expire dans 24 heures

    // Stocke le lien temporaire dans la base de données ou en mémoire (par exemple, dans Redis)
    await app.repository.fileRepository.createLink(userId, {
        file_id: parseInt(fileId),
        link: token,
        expiration: new Date(expiration)
    });

    // Retourne le lien temporaire
    return {
        file_id: parseInt(fileId),
        link: `http://localhost:3000/api/file/${fileId}?token=${token}`,
        expiration: new Date(expiration)
    };
}

export async function getFile(app: App, req: Request, res: Response): Promise<void> {

    console.log("getfile")


    const fileId = req.params.id;


    if (!fileId) {
        res.status(401).json({ message: "ID de fichier manquant." });
        return;
    }

    if (req.headers.authorization === undefined) {
        const token = req.query.token as string;
        console.log("token", token);

        if (!token) {
            res.status(401).json({ message: "Token manquant." });
            return;
        }

        const fileLink = await app.repository.fileRepository.getFileLinkFromToken(fileId, token);

        console.log("fileLink", fileLink);

        if (!fileLink) {
            res.status(401).json({ message: "Lien invalide." });
            return;
        }

        if (fileLink.expiration < new Date()) {
            res.status(401).json({ message: "Lien expiré." });
            return;
        }

        if (!fileLink.isOnline){
            res.status(401).json({ message: "Lien désactivé." });
            return;
        }

        const fileNameInStorage = await app.repository.fileRepository.getFileNameInStorage(fileId);

        if (!fileNameInStorage) {
            res.status(404).json({ message: "Fichier introuvable." });
            return;
        }

        app.repository.fileRepository.addVisit(fileId); 

        const file = path.join(__dirname, '../fileStorage', fileNameInStorage);

        res.sendFile(file);
    }
    else {
        const userToken = req.headers.authorization?.split(" ")[1];
        console.log("token", userToken);

        verifyTokenAndGetUser(userToken).then(async (userId) => {
            const fileLink = await app.repository.fileRepository.getFileNameInStorageWithCheck(fileId, userId);

            if (!fileLink) {
                res.status(404).json({ message: "Fichier introuvable." });
                return;
            }

            console.log("fileLink", fileLink);


            const file = path.join(__dirname, '../fileStorage', fileLink);

            console.log("file", file);

            res.sendFile(file);
        });
    }
}


export async function getFilePreview(app: App, req: Request, res: Response): Promise<void> {
    console.log("getFilePreview");

    const fileId = req.params.id;

    if (!fileId) {
        res.status(401).json({ message: "ID de fichier manquant." });
        return;
    }

    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
        res.status(401).json({ message: "Token d'authentification manquant." });
        return;
    }

    try {
        const userId = await verifyTokenAndGetUser(authToken);
        const fileNameInStorage = await app.repository.fileRepository.getFileNameInStorageWithCheck(fileId, userId);

        if (!fileNameInStorage) {
            res.status(404).json({ message: "Fichier introuvable." });
            return;
        }

        const filePath = path.join(__dirname, '../fileStorage', fileNameInStorage);
        const fileType = path.extname(fileNameInStorage).toLowerCase();

        if (fileType === '.jpg' || fileType === '.jpeg' || fileType === '.png') {
            // Prévisualisation d'image
            const preview = await sharp(filePath)
                .resize(200) // Taille réduite pour la prévisualisation
                .toBuffer();
            res.set('Content-Type', 'image/jpeg');
            res.send(preview);
        } else if (fileType === '.pdf') {
            // Prévisualisation PDF : convertir la première page en image
            const options = {
                format: 'jpeg',
                out_dir: path.dirname(filePath),
                out_prefix: path.basename(filePath, path.extname(filePath)),
                page: 1
            };

            const outputPath = `${options.out_dir}/${options.out_prefix}-1.jpg`;

            // Vérifiez si le fichier de prévisualisation existe déjà
            if (!fs.existsSync(outputPath)) {
                await pdf.convert(filePath, options); // Convertit la première page en image
            }

            // Assurez-vous que le fichier de prévisualisation existe avant de le traiter
            if (fs.existsSync(outputPath)) {
                const preview = await sharp(outputPath)
                    .resize(200) // Taille réduite pour la prévisualisation
                    .toBuffer();
                res.set('Content-Type', 'image/jpeg');
                res.send(preview);
            } else {
                res.status(500).json({ message: "Erreur lors de la génération de la prévisualisation du PDF." });
            }
        } else {
            res.status(400).json({ message: "Prévisualisation non disponible pour ce type de fichier." });
        }
    } catch (error) {
        console.error("Erreur lors de la prévisualisation du fichier:", error);
        res.status(500).json({ message: "Erreur lors de la génération de la prévisualisation." });
    }
}



export async function getFileLink(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then(async (userId) => {
        const fileId = req.query.id as string;
        console.log(userId, fileId);
        const file = await app.repository.fileRepository.getFileLink(userId, fileId);

        if (file === null || file.expiration < new Date()) {
            generateTemporarLink(fileId, userId, app).then((fileLink) => {
                console.log("Generated file link:", fileLink);
                res.json(fileLink);
            })
                .catch((error) => {
                    res.status(401).json({ message: error.message });
                })
        }
        else {
            if (file.expiration < new Date()) {
                // Supprimer le lien expiré
                await app.repository.fileRepository.deleteLink(userId, fileId);
            }
            res.json({
                file_id: file.file_id,
                link: `http://localhost:3000/api/file/${fileId}?token=${file.link}`,
                expiration: file.expiration
            })
        }

    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
}

export async function getAllFileLinks(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token", token);

    verifyTokenAndGetUser(token).then(async (userId) => {
        const files = await app.repository.fileRepository.getAllFileLinks(userId);
        res.json(files);
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
}

export async function toggleFileLinkStatus(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("toggle status");

    verifyTokenAndGetUser(token).then(async (userId) => {
        //server.put('/api/link/:id/status', bindApp(toggleFileLinkStatus));

        const fileId = req.params.id;
        console.log("fileId", fileId);
        const fileLink = await app.repository.fileRepository.getFileLinkFromLinkId(userId, fileId);

        if (fileLink === null) {
            res.status(404).json({ message: "Lien introuvable." });
            return;
        }

        await app.repository.fileRepository.toggleFileLinkStatus(userId, fileId);

        res.json({ message: "Lien mis à jour avec succès." });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
}

export async function changeFileLinkExpirationDate(app: App, req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("change expiration date");

    verifyTokenAndGetUser(token).then(async (userId) => {
        //server.put('/api/link/:id/expiration', bindApp(changeFileLinkExpirationDate));

        const linkId = req.params.id;
        console.log("linkId", linkId);
        const fileLink = await app.repository.fileRepository.getFileLinkFromLinkId(userId, linkId);

        if (fileLink === null) {
            res.status(404).json({ message: "Lien introuvable." });
            return;
        }

        const expiration = req.body.expiration;
        console.log("expiration", expiration);

        await app.repository.fileRepository.changeFileLinkExpirationDate(userId, linkId, expiration);

        res.json({ message: "Lien mis à jour avec succès." });
    }).catch((error) => {
        console.log("error", error);
        res.status(401).json({ message: error.message });
    });
}