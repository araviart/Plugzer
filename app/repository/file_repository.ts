import { Pool } from "mysql2/promise";
import { TodoI, TodoRepositoryI } from "../type/todo";
import { FileLink, FileRepositoryI, File } from "../type/file";
import { UserI } from "../type/user";

export function getFileRepository(database: Pool): FileRepositoryI {
  return {
    getFiles: async (userId: number, parentFolderId : number | null) : Promise<any> => {
      console.log('get files');
  
      console.log('parentFolderId', parentFolderId);
      console.log('userId', userId);

      const query = parentFolderId === null
          ? "SELECT * FROM storage WHERE utilisateur_id = ? AND dossier_parent_id IS NULL"
          : "SELECT * FROM storage WHERE utilisateur_id = ? AND dossier_parent_id = ?";
      
      const [results] = await database.query(query, parentFolderId === null ? [userId] : [userId, parentFolderId]);
  
      console.log('results', results);

      //@ts-ignore
      return results || null;
    },
    addFile: async (file: File) => {
      await database.execute("INSERT INTO storage (id, utilisateur_id, nom_fichier, taille_fichier) VALUES (?, ?, ?)", [file.user_id, file.filename, file.filesize]);
      },
    createLink: async (fileLink: FileLink) => {
      await database.execute("INSERT INTO file_links (file_id, link,) VALUES (?, ?, ?)", [fileLink.file_id, fileLink.link, fileLink.expiration]);
      return fileLink;
    },
  };
}
