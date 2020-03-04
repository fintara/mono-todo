import { AsyncAction, filter, map, mutate, Operator, pipe } from "overmind"
import { Show, TodoId } from "./types"

export const setShow: Operator<Show> =
  mutate(({ state }, value) => state.todos.show = value)

export const load: AsyncAction = async ({ state, actions, effects }) => {
  return state.todos.mode.loading(async () => {
    try {
      const list = await effects.todos.api.getTodos()
      return state.todos.mode.loaded(() => {
        state.todos.items = list.reduce((acc, next) => Object.assign(acc, { [next.id]: next }), {})
        actions.todos.setShow("all")
      })
    } catch (e) {
      return state.todos.mode.loaded()
    }
  })
}

export const toggle: AsyncAction<TodoId> = async ({ state }, id) => {
  state.todos.items[id].done = !state.todos.items[id].done
}

export const add: Operator<string> = pipe(
  map((_, value) => value.trim()),
  filter((_, value) => value.length > 0),
  mutate(({ state }, value) => state.todos.items[value] = { id: value, content: value, done: false })
)
