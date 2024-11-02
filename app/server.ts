import express, { Request, Response } from 'express';
import cors from 'cors';
import { getRoutes } from "./route/api";
import { getAdminRoutes } from "./route/admin";
import mysql from 'mysql2/promise';
import { getRepository } from "./repository/repository";
import { App } from "./type/app";
import * as process from "node:process";
import path from 'path';
import { fileURLToPath } from 'url';
import { register, login, verifyToken } from './controller/auth_controller';
import { addFolder, getFolders, deleteFolder, renameFolder } from './controller/folder_controller'; 
import { getUsedStorage } from './controller/user_controller';
import {deleteFile, addFile, getFileLink, getFile, getFilePreview, getAllFileLinks, toggleFileLinkStatus,changeFileLinkExpirationDate} from './controller/file_controller';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 3000;

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

server.use(cors());

const repository = getRepository(database);

const app: App = {
    repository
};

const routes = getRoutes(app);
const adminRoutes = getAdminRoutes();

server.use(express.json());

server.use(express.static(path.join(__dirname, 'client/dist')));

const bindApp = (handler: (app: App, req: Request, res: Response) => Promise<void>) => {
    return (req: Request, res: Response) => handler(app, req, res);
};

server.get('/api/user/storage', bindApp(getUsedStorage))

server.post('/api/auth/register', bindApp(register));
server.post('/api/auth/login', bindApp(login));
server.get('/api/verify-token', bindApp(verifyToken));
server.post('/api/folder', bindApp(addFolder));
//server.put('/api/folder/:id', bindApp(updateFolder));
server.patch('/api/folder/:id', bindApp(renameFolder));
server.delete('/api/folder/:id', bindApp(deleteFolder));

// je veux que sur la route folder?id=... ça le fasse
server.get('/api/folder', bindApp(getFolders));

server.delete('/api/file/:id', bindApp(deleteFile));

server.post('/api/file', bindApp(addFile));

server.use('/api', routes);

server.get('/api/file/link', bindApp(getFileLink));
server.get('/api/links', bindApp(getAllFileLinks));
server.get('/api/file/:id', bindApp(getFile));
server.get('/api/file/:id/preview', bindApp(getFilePreview));
server.put('/api/link/:id/status', bindApp(toggleFileLinkStatus));
// /api/link/${linkId}/expiration
server.put('/api/link/:id/expiration', bindApp(changeFileLinkExpirationDate));

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

server.use('/api', (req, res, next) => {
    res.status(404);
    res.json({
        message: "t'es perdu"
    });
});

// Add a simple test route
server.get('/api/test', (req, res) => {
    res.json({ message: "Server is running" });
});

server.listen(port, () => console.log(`App running on port ${port}`));