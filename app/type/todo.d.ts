export interface TodoI {
    id?: number,
    title: string,
    completed: boolean
}

export interface TodoRepositoryI {
    getAll: () => Promise<TodoI[]>
    getOne: (id: number) => Promise<TodoI>
    insert: (todo: TodoI) => Promise<TodoI>
    update: (todo: TodoI) => Promise<TodoI>
    delete: (id: number) => Promise<void>
}
