import { Pool } from "mysql2/promise";
import { UserI } from "../type/user";

export function getUserRepository(database: Pool) {
    return {
        async findUserByEmail(email: string): Promise<UserI | null> {
            const [results] = await database.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
            //@ts-ignore
            return results[0] || null;
        },
        async insertUser(user: UserI): Promise<void> {
            await database.execute("INSERT INTO utilisateur (nom, email, mdp) VALUES (?, ?, ?)", [user.nom, user.email, user.password]);
        }
    };
}
