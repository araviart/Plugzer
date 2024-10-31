import { Pool } from "mysql2/promise";
import { FolderRepositoryI } from "../type/folder";
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

export function getFolderRepository(database: Pool) : FolderRepositoryI {
    return {
        async getParentFolderIdFromPath(userId: number, path: string): Promise<number> {
            console.log('normalement ça cherche si ça existe')
            const [results] = await database.query("SELECT id FROM dossier WHERE path = ? and utilisateur_id = ?", [path, userId]);
            //@ts-ignore
            return results[0] || null;
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
        async deleteFolder(userId: number, folderId: number): Promise<void> {
            console.log('normalement ça cherche si ça existe')
            const [results] = await database.query("DELETE FROM dossier WHERE id = ? and utilisateur_id = ?", [folderId, userId]);
            //@ts-ignore
            return results[0] || null;
        },
        async getFolders(userId: number, path: string | null): Promise<any> {
            console.log('normalement ça cherche si ça existe');
            
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
