import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { App } from "../type/app";

const JWT_SECRET = "votre_secret";

export async function register(app: App, req: Request, res: Response): Promise<void> {
    const { nom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await app.repository.userRepository.insertUser({ nom, email, password: hashedPassword });
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
}

export async function login(app: App, req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
        const user = await app.repository.userRepository.findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "Utilisateur introuvable" });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(400).json({ message: "Mot de passe incorrect" });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
}