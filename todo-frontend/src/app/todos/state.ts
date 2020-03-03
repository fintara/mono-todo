import { Derive, statemachine, Statemachine } from "overmind"
import { Show, Todo, TodoId } from "./types"

type State = {
  mode: Statemachine<"loading" | "loaded">
  items: Record<TodoId, Todo>
  list: Derive<State, Todo[]>
  show: Show,
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
  list: (self) => Object.values(self.items),
  show: "all"
}
