export interface UserI {
    id?: number,
    nom: string,
    email: string,
    password: string
}

export interface UserRepositoryI {
    findUserByEmail(email: string): Promise<UserI | null>;
    insertUser(user: UserI): Promise<void>;
}