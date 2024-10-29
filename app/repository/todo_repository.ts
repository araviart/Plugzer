import {Pool} from "mysql2/promise";
import {TodoI, TodoRepositoryI} from "../type/todo";

export function getTodoRepository(database: Pool): TodoRepositoryI {
    return {
        getAll: async () => {
            const [results] = await database.query("SELECT id, title, completed FROM todo");
            return results as TodoI[]
        },
        delete: async (id: number) => {
            await database.execute("DELETE FROM todo where id = ?", [id]);
        },
        getOne: async (id: number) => {
            const [results] = await database.execute("SELECT id, title, completed FROM todo WHERE id = ?", [id]);
            //@ts-ignore
            return results[0]
        }, insert(todo: TodoI): Promise<TodoI> {
            return Promise.resolve({id: 1, title: "test", completed: true});
        }, update(todo: TodoI): Promise<TodoI> {
            return Promise.resolve({id: 1, title: "test", completed: true});
        },
    }
}
