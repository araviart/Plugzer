import {Repository} from "../type/repository";
import {getTodoRepository} from "./todo_repository";
import {Connection, Pool} from "mysql2/promise";

export function getRepository(database: Pool): Repository {
    return {
        todoRepository: getTodoRepository(database)
    }
}
