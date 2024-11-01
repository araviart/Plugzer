import { Pool } from "mysql2/promise";
import { TodoI, TodoRepositoryI } from "../type/todo";
import { FileLink, FileRepositoryI, File } from "../type/file";
import { UserI } from "../type/user";

/*
 * CREATE TABLE lien_fichier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fichier_id INT NOT NULL,
  lien VARCHAR(255) NOT NULL,
  date_expiration DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL 1 DAY),
  FOREIGN KEY (fichier_id) REFERENCES storage(id)
);
 */
export function getFileRepository(database: Pool): FileRepositoryI {
  return {
    async deleteLink(userId: number, fileId: string): Promise<void> {
      console.log('delete link');
      console.log('fileId', fileId);
      console.log('userId', userId);
      await database.execute("DELETE FROM lien_fichier WHERE fichier_id = ?", [fileId]);
    },
    async createLink(userId: number, fileLink: FileLink): Promise<FileLink> {
      console.log('create link');
      console.log('fileLink', fileLink);
      await database.execute("INSERT INTO lien_fichier (fichier_id, lien, date_expiration) VALUES (?, ?, ?)", [fileLink.file_id, fileLink.link, fileLink.expiration]);
      return fileLink;
    },
    async getFileNameInStorageWithCheck(fileId, userId) {
      console.log('get file name in storage with check');
      console.log('fileId', fileId);
      console.log('userId', userId);
      const [results] = await database.query("SELECT fileNameInStorage FROM storage WHERE id = ? AND utilisateur_id = ?", [fileId, userId]);
      //@ts-ignore
      return results[0].fileNameInStorage || null;
    },
   async getFileNameInStorage(fileId: string): Promise<string> {
      console.log('get file name in storage');
      console.log('fileId', fileId);
      const [results] = await database.query("SELECT fileNameInStorage FROM storage WHERE id = ?", [fileId]);
      //@ts-ignore
      return results[0].fileNameInStorage || null;
   }, 
   async getFileLinkFromToken(fileId: string, token: string): Promise<FileLink> {
      console.log('get file link from token');
      console.log('fileId', fileId);
      console.log('token', token);
      const [results] = await database.query("SELECT fichier_id as file_id, lien as link, date_expiration as expiration FROM lien_fichier WHERE fichier_id = ? AND lien = ?", [fileId, token]);
      //@ts-ignore
      return results[0] || null;
    },
    async getFileLink(userId: number, fileId: string): Promise<FileLink> {
      console.log('get file link');
      console.log('fileId', fileId);
      console.log('userId', userId);
      const [results] = await database.query("SELECT lien_fichier.id, fichier_id as file_id, lien as link, date_expiration as expiration FROM lien_fichier JOIN storage on lien_fichier.fichier_id = storage.id WHERE fichier_id = ? AND storage.utilisateur_id=?", [fileId, userId]);
      //@ts-ignore
      return results[0] || null;
    },
    async deleteFile(userId: number, fileId: number): Promise<void> {
      console.log('delete file');
      console.log('fileId', fileId);
      console.log('userId', userId);
      await database.execute("DELETE FROM storage WHERE utilisateur_id = ? AND id = ?", [userId, fileId]);
    },
    async deleteFilesInsideFolder(userId: number, folderId: number): Promise<void> {
      console.log('delete files inside folder');
      console.log('folderId', folderId);
      console.log('userId', userId);
      await database.execute("DELETE FROM storage WHERE utilisateur_id = ? AND dossier_parent_id = ?", [userId, folderId]);
    },
    getFiles: async (userId: number, parentFolderId : number | null) : Promise<any> => {
      console.log('get files');
  
      console.log('parentFolderId', parentFolderId);
      console.log('userId', userId);

      const query = parentFolderId === null
          ? "SELECT * FROM storage WHERE utilisateur_id = ? AND dossier_parent_id IS NULL"
          : "SELECT * FROM storage WHERE utilisateur_id = ? AND dossier_parent_id = ?";
      
      const [results] = await database.query(query, parentFolderId === null ? [userId] : [userId, parentFolderId]);
  
  //    console.log('results', results);

      //@ts-ignore
      return results || null;
    },
    addFile: async (userId: number,file: Express.Multer.File, path: string|null, parentFolderId: number | null) => {
      await database.execute("INSERT INTO storage (utilisateur_id, nom, taille_fichier, dossier_parent_id, path, fileNameInStorage) VALUES (?, ?, ?, ?, ?, ?)", [userId, file.originalname, file.size, parentFolderId, path, file.filename]);
      },
  };
}
