import { Action, AsyncAction, mutate, Operator } from "overmind"
import { DueFilter, SizeFilter, Todo, TodoId } from "./types"
import { toMap } from "../common/utils"


export const load: AsyncAction = async ({ state, actions, effects }) => {
  return state.todos.mode.loading(async () => {
    try {
      const list = await effects.todos.api.getAll()
      return state.todos.mode.loaded(() => {
        state.todos.items = toMap(list.map(it => ({
          ...it,
          createdAt: new Date(it.createdAt),
        })))
      })
    } catch (e) {
      console.error(e)
      actions.toaster.showError("Could not load todos.")
      return state.todos.mode.loaded()
    }
  })
}

export const toggle: AsyncAction<TodoId> = async ({ state, actions, effects }, id) => {
  const item = state.todos.items[id]
  item.done = !item.done

  try {
    await effects.todos.api.update(id, { done: item.done })
  } catch (e) {
    item.done = !item.done
    actions.toaster.showError("Could not save changes.")
  }
}

export const edit: AsyncAction<{ id: TodoId, content: string }> = async ({ state, actions, effects }, { id, content: _content }) => {
  const item = state.todos.items[id]
  const content = _content.trim()

  if (!item || !content || item.content === content) {
    return
  }

  const original = item.content
  item.content = content

  try {
    await effects.todos.api.update(id, { content })
    actions.toaster.showSuccess("Todo was saved.")
  } catch (e) {
    item.content = original
    actions.toaster.showError("Could not save changes.")
  }
}

export const changeDeadline: AsyncAction<{ id: TodoId, deadline: Date }> = async (
  { state, actions, effects },
  { id, deadline: _deadline }
) => {
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
    actions.toaster.showError("Could not save changes.")
  }
}

export const removeDeadline: AsyncAction<TodoId> = async ({ state, actions, effects }, id) => {
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
    actions.toaster.showError("Could not save changes.")
  }
}

export const add: AsyncAction<string> = async ({ state, actions, effects }, _content) => {
  const content = _content.trim()

  if (content.length === 0) {
    return
  }

  const createdAt = new Date()
  const id = createdAt.getTime().toString()

  const todoOptimistic: Todo = { id, content, deadline: null, createdAt, done: false }
  state.todos.disabled.push(todoOptimistic.id)
  state.todos.items[todoOptimistic.id] = todoOptimistic

  try {
    const todo = await effects.todos.api.create({ content })
    state.todos.items[todo.id] = {...todo, createdAt }
  } catch (e) {
    console.error(e)
    actions.toaster.showError("Could not add a new todo.")
  } finally {
    delete state.todos.items[todoOptimistic.id]
    const index = state.todos.disabled.indexOf(todoOptimistic.id)
    index > -1 && state.todos.disabled.splice(index, 1)
  }
}

export const remove: AsyncAction<TodoId> = async ({ state, actions, effects }, id) => {
  const item = state.todos.items[id]

  if (!item) {
    return
  }

  const original = {...item}
  delete state.todos.items[id]

  try {
    await effects.todos.api.delete(id)
    actions.toaster.showSuccess("Todo was removed.")
  } catch (e) {
    state.todos.items[id] = original
    actions.toaster.showError("Could not remove the todo.")
  }
}

export const changeSize: Action<SizeFilter> = ({ state }, value) => {
  state.todos.pageSize = value
}

export const changeDue: Action<DueFilter> = ({ state }, value) => {
  state.todos.dueFilter = value
}

export const nextPage: Action = ({ state }) => {
  if (state.todos.count <= state.todos.page * state.todos.pageSize) {
    return
  }

  state.todos.page++
}

export const previousPage: Action = ({ state }) => {
  if (state.todos.page === 0) {
    return
  }

  state.todos.page--;
}

export const reset: Action = ({ state }) => {
  state.todos.items = {}
  state.todos.dueFilter = "off"
}