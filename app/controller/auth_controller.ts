import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { App } from "../type/app";

const JWT_SECRET = "secretkeyg";

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

    if (!email || !password) {
        res.status(400).json({ message: "Les champs 'email' et 'mot de passe' sont requis." });
        return;
    }

    try {
        const user = await app.repository.userRepository.findUserByEmail(email);
        console.log("valeur de l'utilisateur", user);
        console.log("valeur de l'email", user?.email);
        console.log("valeur du mot de passe", user?.password);
        
        if (!user) {
            res.status(404).json({ message: "Utilisateur introuvable. Veuillez vérifier votre adresse e-mail." });
            console.log("user", user);
            return;
        }

        if (!user.password) {
            res.status(500).json({ message: "Erreur interne du serveur. Mot de passe de l'utilisateur introuvable." });
            return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: "Mot de passe incorrect. Veuillez réessayer." });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur interne du serveur. Veuillez réessayer plus tard." });
    }
}
