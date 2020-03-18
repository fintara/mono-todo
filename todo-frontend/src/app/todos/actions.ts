import { Action, AsyncAction, catchError, filter, map, mutate, Operator, pipe } from "overmind"
import { Show, TodoId } from "./types"
import { toMap } from "../common/utils"

export const setShow: Operator<Show> =
  mutate(({ state }, value) => state.todos.show = value)

export const load: AsyncAction = async ({ state, actions, effects }) => {
  return state.todos.mode.loading(async () => {
    try {
      const list = await effects.todos.api.getAll()
      return state.todos.mode.loaded(() => {
        state.todos.items = toMap(list.map(it => ({
          ...it,
          createdAt: new Date(it.createdAt),
        })))
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

  try {
    await effects.todos.api.update(id, { done: item.done })
  } catch (e) {
    item.done = !item.done
    effects.toaster.instance.showMessage("Could not save changes.", "danger")
  }
}

export const edit: AsyncAction<{ id: TodoId, content: string }> = async ({ state, effects }, { id, content: _content }) => {
  const item = state.todos.items[id]
  const content = _content.trim()

  if (!item || !content || item.content === content) {
    return
  }

  const original = item.content
  item.content = content

  try {
    await effects.todos.api.update(id, { content })
    effects.toaster.instance.showMessage("Todo was saved.", "success")
  } catch (e) {
    item.content = original
    effects.toaster.instance.showMessage("Could not save changes.", "danger")
  }
}

export const changeDeadline: AsyncAction<{ id: TodoId, deadline: Date }> = async ({ state, effects }, { id, deadline: _deadline }) => {
  const item = state.todos.items[id]
  const originalValue = item.deadline
  const deadline = _deadline.toISOString()

  if (!item || item.deadline === deadline) {
    return
  }

  item.deadline = deadline
  try {
    const updated = await effects.todos.api.update(id, { deadline })
    item.deadline = updated.deadline
  } catch (e) {
    item.deadline = originalValue
    effects.toaster.instance.showMessage("Could not save changes.", "danger")
  }
}

export const removeDeadline: AsyncAction<TodoId> = async ({ state, effects }, id) => {
  const item = state.todos.items[id]
  const originalValue = item.deadline

  if (!item || item.deadline === null) {
    return
  }

  item.deadline = null
  try {
    await effects.todos.api.update(id, { deadline: new Date(0).toISOString() })
  } catch (e) {
    item.deadline = originalValue
    effects.toaster.instance.showMessage("Could not save changes.", "danger")
  }
}

export const add: Operator<string> = pipe(
  map((_, value) => value.trim()),
  filter((_, value) => value.length > 0),
  map(async ({ effects }, content) => effects.todos.api.create({ content })),
  mutate(({ state }, todo) => state.todos.items[todo.id] = todo),
  catchError(({ effects }) => effects.toaster.instance.showMessage("Could not add new todo.", "danger"))
)

export const remove: AsyncAction<TodoId> = async ({ state, effects }, id) => {
  const item = state.todos.items[id]

  if (!item) {
    return
  }

  const original = {...item}
  delete state.todos.items[id]

  try {
    await effects.todos.api.delete(id)
    effects.toaster.instance.showMessage("Todo was removed.", "success")
  } catch (e) {
    state.todos.items[id] = original
    effects.toaster.instance.showMessage("Could not remove the todo.", "danger")
  }
}

export const reset: Action = ({ state }) => {
  state.todos.items = {}
  state.todos.show = "all"
}