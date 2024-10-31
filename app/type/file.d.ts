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
  addFile: (file: File) => Promise<void>;
  createLink: (fileLink: FileLink) => Promise<FileLink>;
}


