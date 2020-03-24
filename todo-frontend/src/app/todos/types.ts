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
export function isDueFilter(value: string): value is DueFilter {
  return dueFilters.includes(value as any)
}

export const sizeFilters = [5, 10, 25, 1000] as const
export type SizeFilter = typeof sizeFilters[number]
export function isSizeFilter(value: number): value is SizeFilter {
  return sizeFilters.includes(value as any)
}

export const visibilityFilters = ["all", "done", "tbd"] as const
export type VisibilityFilter = typeof visibilityFilters[number]
export function isVisibilityFilter(value: string): value is VisibilityFilter {
  return visibilityFilters.includes(value as any)
}