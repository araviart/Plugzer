import { Pool } from "mysql2/promise";
import { UserI } from "../type/user";

export function getUserRepository(database: Pool) {
    return {
        async getUsedStorage(userId: number): Promise<{ totalStorageUsed: number; maxStorage: number }> {
            // on récupère le stockage maximal par utilisateur
            // avec cette fonction : SELECT max_storage FROM plugzer.max_storage LIMIT 1;

            console.log('ça cherche le stockage max')

            const maxStorage = await database.query("SELECT max_storage FROM plugzer.max_storage LIMIT 1");

            //console.log(maxStorage[0][0].max_storage);

            // on récup ensuite le stockage total utilisé par l'utilisateur:
            // select get_total_storage_used(1);

            const [results] = await database.query("SELECT get_total_storage_used(?)", [userId]);

           // console.log(results[0][`get_total_storage_used(${userId})`]);

            //@ts-ignore
            return { totalStorageUsed: results[0][`get_total_storage_used(${userId})`], maxStorage: maxStorage[0][0].max_storage };
        },
        async findUserByEmail(email: string): Promise<UserI | null> {
            console.log('normalement ça cherche si ça existe')
            const [results] = await database.query("SELECT * FROM utilisateur WHERE email = ?", [email]);
            //@ts-ignore
            return results[0] || null;
        },
        async insertUser(user: UserI): Promise<void> {
            console.log(user);
            await database.execute("INSERT INTO utilisateur (nom, email, password) VALUES (?, ?, ?)", [user.nom, user.email, user.password]);
        },
    };
}
