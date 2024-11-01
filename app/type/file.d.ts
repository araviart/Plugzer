export interface File {
  user_id?: number,
  filename: string,
  filesize: number,
  lastOpenedAt: Date,
}

export interface FileLink {
  id?: number,
  file_id: number,
  link: string,
  expiration: Date,
  visites?: number,
  isOnline?: boolean,
  fileName?: string,
  fileId?: string,
 }

export interface FileRepositoryI {
  getFiles(userId: number, parentFolderId: number | null): Promise<File[]>;
  addFile: (userId:number, file: Express.Multer.File, path: string | null, parentFolderId: number | null) => Promise<void>;
  createLink: (userId, fileLink: FileLink) => Promise<FileLink>;
  deleteFilesInsideFolder: (userId: number, folderId: number) => Promise<void>;
  deleteFile: (userId: number, fileId: number) => Promise<void>;
  getFileLink: (userId: number, fileId: string) => Promise<FileLink>;
  getFileLinkFromToken: (fileId: string, token: string) => Promise<FileLink>;
  getFileNameInStorage: (fileId: string) => Promise<string>;
  getFileNameInStorageWithCheck: (fileId: string, userId: number) => Promise<string>;
  deleteLink: (userId: number, fileId: string) => Promise<void>;
  addVisit: (fileId: string) => Promise<void>;
  getAllFileLinks: (userId: number) => Promise<FileLink[]>;
  toggleFileLinkStatus: (userId: number, linkId: string) => Promise<void>;
  getFileLinkFromLinkId:(userId: number, linkId: string) => Promise<FileLink>;
  changeFileLinkExpirationDate: (userId: number, linkId: string, expiration: Date) => Promise<void>;
}


