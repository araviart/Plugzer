export interface File {
  user_id?: number,
  filename: string,
  filesize: number,
}

export interface FileLink {
  file_id: number,
  link: string,
  expiration: Date,
 }

export interface FileRepositoryI {
  getFiles: () => Promise<File[]>
  addFile: (file: File) => Promise<File>
  createLink: (fileLink: FileLink) => Promise<FileLink>
}
