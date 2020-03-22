import { Derive, statemachine, Statemachine } from "overmind"
import { DueFilter, SizeFilter, Todo, TodoId } from "./types"
import { showDueFilter } from "./utils"

type State = {
  mode: Statemachine<"loading" | "loaded">
  items: Record<TodoId, Todo>
  list: Derive<State, TodoId[]>
  count: Derive<State, number>
  disabled: TodoId[]
  page: number
  pageSize: SizeFilter
  dueFilter: DueFilter
}

export const state: State = {
  mode: statemachine({
    initial: "loading",
    states: {
      loading: ["loading", "loaded"],
      loaded: ["loading"]
    }
  }),
  items: {},
  list: (self) => Object
    .keys(self.items)
    .sort((a, b) => self.items[b].createdAt.getTime() - self.items[a].createdAt.getTime())
    .filter(it => showDueFilter(self.items[it], self.dueFilter, new Date()))
    .slice(self.page * self.pageSize, (1 + self.page) * self.pageSize),
  count: (self) => Object.keys(self.items).length,
  disabled: [],
  page: 0,
  pageSize: 1000,
  dueFilter: "off",
}
