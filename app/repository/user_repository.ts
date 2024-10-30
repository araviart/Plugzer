import { Pool } from "mysql2/promise";
import { UserI } from "../type/user";

export function getUserRepository(database: Pool) {
    return {
        async findUserByEmail(email: string): Promise<UserI | null> {
            console.log('normalement ça cherche si ça existe')
            const [results] = await database.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
            //@ts-ignore
            return results[0] || null;
        },
        async insertUser(user: UserI): Promise<void> {
            console.log(user);
            await database.execute("INSERT INTO utilisateur (nom, email, password) VALUES (?, ?, ?)", [user.nom, user.email, user.password]);
        }
    };
}
