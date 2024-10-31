import { Pool } from "mysql2/promise";
import { FolderRepositoryI } from "../type/folder";
import { FileRepositoryI } from "../type/file";
/* 
       CREATE TABLE `dossier` (
           `id` int NOT NULL AUTO_INCREMENT,
           `nom` varchar(255) NOT NULL,
           `dossier_parent_id` int DEFAULT NULL,
           path varchar(255) NOT NULL,
           PRIMARY KEY (`id`),
           KEY `dossier_parent_id` (`dossier_parent_id`),
           CONSTRAINT `dossier_ibfk_1` FOREIGN KEY (`dossier_parent_id`) REFERENCES `dossier` (`id`) ON DELETE SET NULL
           ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

       */

export function getFolderRepository(database: Pool): FolderRepositoryI {
    return {
        async getParentFolderIdFromPath(userId: number, path: string): Promise<number> {
            console.log('getParentFolderIdFromPath');
            console.log(path);
            console.log(userId)

            const isPathRoot = path === '/' || !path.includes('/');
            console.log(isPathRoot)
            const currentFolderName = !isPathRoot ? path.split('/').pop() : path;
            console.log(currentFolderName)
            const finalPath = !isPathRoot ? path.split('/').slice(0, -1).join('/') : null;

            const query = isPathRoot
                ? "SELECT id FROM dossier WHERE nom = ? AND path IS NULL AND utilisateur_id = ?"
                : "SELECT id FROM dossier WHERE nom = ? AND path = ? AND utilisateur_id = ?";

            const params = isPathRoot ? [currentFolderName, userId] : [currentFolderName, finalPath, userId];

            const [results] = await database.query(query, params);

            console.log("results", results)

            //@ts-ignore
            return results[0] ? results[0].id : null;
        },
        async addFolder(userId: number, folderName: string, path: string | null): Promise<void> {
            console.log('normalement ça cherche si ça existe')
            const parentFolderId = path ? await this.getParentFolderIdFromPath(userId, path) : null;
            console.log('parentFolderId', parentFolderId)
            console.log('userId', userId)
            console.log('folderName', folderName)
            const [results] = await database.query("INSERT INTO dossier (nom, dossier_parent_id, utilisateur_id, path) VALUES (?, ?, ?, ?)", [folderName, parentFolderId, userId, path]);
            //@ts-ignore
            return results[0] || null;
        },
        async updateFolder(userId: number, folderId: number, folderName: string): Promise<void> {
            console.log('normalement ça cherche si ça existe')
            const [results] = await database.query("UPDATE dossier SET nom = ? WHERE id = ? and utilisateur_id = ?", [folderName, folderId, userId]);
            //@ts-ignore
            return results[0] || null;
        },
        async deleteFolder(userId: number, folderId: number, force:boolean, fileRepository:FileRepositoryI): Promise<void> {
            console.log('normalement ça cherche si ça existe');
        
            // Vérifier si le dossier est le parent d'autres dossiers
            const [subfolderResults]: any = await database.query(
                "SELECT * FROM dossier WHERE dossier_parent_id = ?",
                [folderId]
            );
        
            const subfolderCount = subfolderResults.length;
        
            if (subfolderCount > 0 && !force) {
                throw new Error("Le dossier ne peut pas être supprimé car il contient des sous-dossiers.");
            }

            console.log('subfolderResults', subfolderResults);

            const [fileResults]: any = await database.query(
                "SELECT * FROM storage WHERE dossier_parent_id = ?",
                [folderId]
            );

            console.log(fileResults);


            const fileCount = fileResults.length;

            console.log('fileCount', fileCount);

            if (fileCount > 0 && !force) {
                console.log('Le dossier ne peut pas être supprimé car il contient des fichiers.');
                throw new Error("Le dossier ne peut pas être supprimé car il contient des fichiers.");
            }   

            // on va supprimer tout les fichiers du dossier 

            await fileRepository.deleteFilesInsideFolder(userId, folderId);

        
            // Si aucun sous-dossier n'est trouvé, procéder à la suppression
            await database.query(
                "DELETE FROM dossier WHERE id = ? AND utilisateur_id = ?",
                [folderId, userId]
            );
            
            // on va supprimer tout recursivement les sous dossiers

            subfolderResults.forEach(async (subfolder: any) => {
                await this.deleteFolder(userId, subfolder.id, true);
            });
        
            console.log('Dossier supprimé avec succès.');
        },        
        async getFolders(userId: number, path: string | null): Promise<any> {
            console.log('normalement ça cherche si ça existe');

            console.log("get folders path", path)

            const parentFolderId = path ? await this.getParentFolderIdFromPath(userId, path) : null;

            console.log('parentFolderId', parentFolderId);
            console.log('userId', userId);

            const query = parentFolderId === null
                ? "SELECT * FROM dossier WHERE utilisateur_id = ? AND dossier_parent_id IS NULL"
                : "SELECT * FROM dossier WHERE utilisateur_id = ? AND dossier_parent_id = ?";

            const [results] = await database.query(query, parentFolderId === null ? [userId] : [userId, parentFolderId]);

            //@ts-ignore
            return results || null;
        }

    };
}
