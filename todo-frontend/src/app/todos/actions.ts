import { AsyncAction, filter, map, mutate, Operator, pipe } from "overmind"
import { Show, TodoId } from "./types"
import { toMap } from "../common/utils"

export const setShow: Operator<Show> =
  mutate(({ state }, value) => state.todos.show = value)

export const load: AsyncAction = async ({ state, actions, effects }) => {
  return state.todos.mode.loading(async () => {
    try {
      const list = await effects.todos.api.getAll()
      return state.todos.mode.loaded(() => {
        state.todos.items = toMap(list)
        actions.todos.setShow("all")
      })
    } catch (e) {
      console.error(e)
      return state.todos.mode.loaded()
    }
  })
}

export const toggle: AsyncAction<TodoId> = async ({ state, effects }, id) => {
  const item = state.todos.items[id]
  item.done = !item.done
  await effects.todos.api.update(id, { done: item.done })
}

export const add: Operator<string> = pipe(
  map((_, value) => value.trim()),
  filter((_, value) => value.length > 0),
  map(async ({ effects }, content) => effects.todos.api.create({ content })),
  mutate(({ state }, todo) => state.todos.items[todo.id] = todo)
)
