export interface File {
  user_id?: number,
  filename: string,
  filesize: number,
  lastOpenedAt: Date,
}

export interface FileLink {
  file_id: number,
  link: string,
  expiration: Date,
 }

export interface FileRepositoryI {
  getFiles(userId: number, parentFolderId: number | null): Promise<File[]>;
  addFile: (userId:number, file: Express.Multer.File, path: string | null, parentFolderId: number | null, fileNameInStorage: string) => Promise<void>;
  createLink: (fileLink: FileLink) => Promise<FileLink>;
  deleteFilesInsideFolder: (userId: number, folderId: number) => Promise<void>;
  deleteFile: (userId: number, fileId: number) => Promise<void>;
}


