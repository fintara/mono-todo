import { Derive } from "overmind"
import { Todo, TodoId } from "./types"

type State = {
  items: Record<TodoId, Todo>
  list: Derive<State, Todo[]>
}

export const state: State = {
  items: {},
  list: (self) => Object.values(self.items)
}
