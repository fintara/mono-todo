export type TodoId = string

export interface Todo {
  id: TodoId
  content: string
  done: boolean
  deadline: string | null
  createdAt: Date
}

export type TodoPatch = Partial<Omit<Todo, "id">>

export interface TodoCreate {
  content: string
}

export const dueFilters = ["off", "today", "in 2 days", "this week", "next week"] as const
export type DueFilter = typeof dueFilters[number]

export const sizeFilters = [5, 10, 25, 1000] as const
export type SizeFilter = typeof sizeFilters[number]

export const visibilityFilters = ["all", "done", "tbd"] as const
export type VisibilityFilter = typeof visibilityFilters[number]
