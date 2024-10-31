/* 
CREATE TABLE dossier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom VARCHAR(255) NOT NULL,
    dossier_parent_id INT, -- ID du dossier parent (facultatif)
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (dossier_parent_id) REFERENCES dossier(id) ON DELETE SET NULL
);
*/

import { FileRepositoryI } from "./file";

export interface FolderI {
    id?: number,
    nom: string,
    dossier_parent_id: number | null,
    utilisateur_id: number,
    path: string
    lastOpenedAt: Date
}

export interface FolderRepositoryI {
    addFolder(userId:number, folderName: string, path: string | null): Promise<void>;
    updateFolder(userId:number,folderId: number, folderName: string): Promise<void>;
    deleteFolder(userId:number,folderId: number, force:boolean, fileRepository?: FileRepositoryI): Promise<void>;
    getFolders(userId:number, path: string | null): Promise<FolderI[]>;
    getParentFolderIdFromPath(userId:number, path: string): Promise<number>;
}