import { Pool } from "mysql2/promise";
import { TodoI, TodoRepositoryI } from "../type/todo";
import { FileLink, FileRepositoryI, File } from "../type/file";
import { UserI } from "../type/user";

export function getFileRepository(database: Pool): FileRepositoryI {
  return {
    getFiles: async (user: UserI) => {
      const [results] = await database.query("SELECT id, utilisateur_id, nom_fichier, taille_fichier FROM fichier WHERE utilisateur_id = ?", [user.id]);
      return results as File[]
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
