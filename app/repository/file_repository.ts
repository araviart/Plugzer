import {Pool} from "mysql2/promise";
import {TodoI, TodoRepositoryI} from "../type/todo";
import { FileLink, FileRepositoryI} from "../type/file";

export function getFileRepository(database: Pool): TodoRepositoryI {
    return {
      addFile: async (todo: File) => {
    },
    createLink: async (todo: FileLink) => {
    },
}}
