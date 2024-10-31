import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

interface CompressedRequest extends Request {
  compressedFilePath?: string;
}

export const compressFilesOrFolder = (folderPath?: string) => {
  return async (req: CompressedRequest, res: Response, next: NextFunction) => {
    try {
      // Set up paths for the output zip file
      const outputDir = path.join(__dirname, '../../compressed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const zipFilePath = path.join(outputDir, `compressed-${Date.now()}.zip`);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', { zlib: { level: 9 } }); // High compression level

      output.on('close', () => {
        console.log(`Compression complete, ${archive.pointer()} total bytes`);
        req.compressedFilePath = zipFilePath; // Attach zip path to the request
        next();
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(output);

      // If multer has uploaded files, add them to the archive
      if (req.files && Array.isArray(req.files)) {
        const files = req.files as Express.Multer.File[];
        files.forEach((file) => {
          archive.file(file.path, { name: file.originalname });
        });
      }

      // If a folder path is provided, add the folder to the archive
      if (folderPath && fs.existsSync(folderPath)) {
        archive.directory(folderPath, false);
      }

      await archive.finalize();
    } catch (error) {
      next(error);
    }
  };
};
