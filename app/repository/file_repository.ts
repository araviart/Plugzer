import { Pool } from "mysql2/promise";
import { TodoI, TodoRepositoryI } from "../type/todo";
import { FileLink, FileRepositoryI, File } from "../type/file";
import { UserI } from "../type/user";

import { format } from 'date-fns';

/*
 *CREATE TABLE `lien_fichier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fichier_id` int NOT NULL,
  `lien` varchar(255) NOT NULL,
  `visites` INT DEFAULT 0,
  `isOnline` BOOLEAN DEFAULT TRUE,
  `date_expiration` TIMESTAMP NOT NULL DEFAULT ((curdate() + interval 1 day)),
  PRIMARY KEY (`id`),
  KEY `fichier_id` (`fichier_id`),
  CONSTRAINT `lien_fichier_ibfk_1` FOREIGN KEY (`fichier_id`) REFERENCES `storage` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

);
 */
export function getFileRepository(database: Pool): FileRepositoryI {
  return {
    changeFileLinkExpirationDate: async (userId: number, linkId: string, expiration: Date): Promise<void> => {
      console.log('change file link expiration date');
      console.log('linkId', linkId);
      console.log('userId', userId);
      console.log('expiration', expiration);

      // Formater la date en 'YYYY-MM-DD HH:MM:SS'
      const formattedExpiration = format(expiration, 'yyyy-MM-dd HH:mm:ss');

      await database.execute(
        "UPDATE lien_fichier INNER JOIN storage ON lien_fichier.fichier_id = storage.id SET lien_fichier.date_expiration = ? WHERE lien_fichier.id = ? AND storage.utilisateur_id = ?;",
        [formattedExpiration, linkId, userId]
      );
    },
    getFileLinkFromLinkId: async (userId: number, linkId: string): Promise<FileLink> => {
      console.log('get file link from link id');
      console.log('linkId', linkId);
      console.log('userId', userId);
      const [results] = await database.query("SELECT fichier_id as file_id, lien as link, date_expiration as expiration FROM lien_fichier JOIN storage on lien_fichier.fichier_id = storage.id WHERE lien_fichier.id = ? AND storage.utilisateur_id=?", [linkId, userId]);
      //@ts-ignore
      return results[0] || null;
    },
    async toggleFileLinkStatus(userId: number, linkId: string): Promise<void> {
      console.log('toggle file link status');
      console.log('fileId', linkId);
      console.log('userId', userId);
      await database.execute("UPDATE lien_fichier SET isOnline = NOT isOnline WHERE id = ?", [linkId]);
    },
    async getAllFileLinks(userId: number): Promise<FileLink[]> {
      console.log('get all file links');
      console.log('userId', userId);
      const [results] = await database.query("SELECT  storage.id as fileId, storage.nom, lien_fichier.id, fichier_id as file_id, lien as link, date_expiration as expiration, visites, isOnline FROM lien_fichier JOIN storage on lien_fichier.fichier_id = storage.id WHERE storage.utilisateur_id=?", [userId]);
      //@ts-ignore
      return results || null;
    },
    async addVisit(fileId: string): Promise<void> {
      console.log('add visit');
      console.log('fileId', fileId);
      await database.execute("UPDATE lien_fichier SET visites = visites + 1 WHERE fichier_id = ?", [fileId]);
    },
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
      const [results] = await database.query("SELECT fichier_id as file_id, lien as link, date_expiration as expiration, isOnline FROM lien_fichier WHERE fichier_id = ? AND lien = ?", [fileId, token]);
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
