import express from 'express'
import cors from 'cors'
import {getRoutes} from "./route/api";
import {getAdminRoutes} from "./route/admin";
import mysql from 'mysql2/promise'
import {getRepository} from "./repository/repository";
import {App} from "./type/app";
import * as process from "node:process";
import path from 'path';
import { fileURLToPath } from 'url';
import { register, login } from './controller/auth_controller';



// Get the directory name in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express()
const port = 3000

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "express"
})

server.use(cors())

const repository = getRepository(database)

const app: App = {
    repository
}

const routes = getRoutes(app)
const adminRoutes = getAdminRoutes()

server.use(express.json())

// Servir les fichiers statiques de l'application React
server.use(express.static(path.join(__dirname, 'client/dist')))

server.post('/api/auth/register', (req, res) => register(app, req, res));
server.post('/api/auth/login', (req, res) => login(app, req, res));

// Routes API
server.use('/api', routes)
// server.use("/admin", adminRoutes)

// Rediriger toutes les autres requêtes vers l'application React
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
})

// Gestion des erreurs 404 pour les routes API
server.use('/api', (req, res, next) => {
    res.status(404)
    res.json({
        message: "t'es perdu"
    })
})

server.listen(port, () => console.log(`App running on port ${port}`))