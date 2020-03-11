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