import { AsyncAction, mutate, Operator } from "overmind"
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
