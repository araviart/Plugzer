import {Repository} from "../type/repository";
import {getTodoRepository} from "./todo_repository";
import {Connection, Pool} from "mysql2/promise";
import {getFileRepository} from "./file_repository";
import {getUserRepository} from "./user_repository";

export function getRepository(database: Pool): Repository {
    return {
        todoRepository: getTodoRepository(database),
        fileRepository: getFileRepository(database),
        userRepository: getUserRepository(database)
    }
}
