import { FileRepositoryI } from "./file";
import {TodoRepositoryI} from "./todo";
import {UserRepositoryI} from "./user";

export interface Repository {
    todoRepository: TodoRepositoryI
    fileRepository: FileRepositoryI
    userRepository: UserRepositoryI 
}
