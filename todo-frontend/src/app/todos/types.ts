import { WithAuthentication } from "../common/http"

export interface Api extends WithAuthentication {
  getAll(): Promise<Todo[]>
  create(todo: TodoCreate): Promise<Todo>
  update(id: TodoId, patch: Partial<Omit<Todo, "id">>): Promise<Todo>
  delete(id: TodoId): Promise<void>
}

export type Show = "all" | "only-done" | "only-todo"

export type TodoId = string

export interface Todo {
  id: TodoId
  content: string
  done: boolean
}

export interface TodoCreate {
  content: string
}