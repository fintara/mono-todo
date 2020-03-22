import { createOvermindMock } from "overmind"
import { config } from "../index"
import { Todo, TodoCreate, TodoPatch } from "./types"

const todos: Todo[] = [
  { id: "aaaaa", content: "Abc", done: false , deadline: null, createdAt: new Date() },
  { id: "bbbbb", content: "Def", done: false , deadline: null, createdAt: new Date() },
  { id: "ccccc", content: "Xyz", done: false , deadline: null, createdAt: new Date() },
  { id: "ddddd", content: "Qwe", done: true , deadline: null, createdAt: new Date() },
  { id: "eeeee", content: "Uvw", done: false , deadline: new Date(new Date().getTime() + 84600).toISOString(), createdAt: new Date() },
]

const showMessage = jest.fn()

const create = (todo: TodoCreate): Promise<Todo> =>
  Promise.resolve({ id: new Date().toUTCString(), deadline: null, createdAt: new Date(), done: false, ...todo })

const deleteTodo = (id: string): Promise<void> => Promise.resolve()

const getAll = (): Promise<Todo[]> => Promise.resolve(todos.map(it => ({ ...it })))

const update = (id: string, patch: Partial<Omit<Todo, "id">>): Promise<Todo> => {
    const todo = todos.find(it => it.id === id)
    if (!todo) {
      return Promise.reject()
    }
    return Promise.resolve({...todo, ...patch})
  }

describe("todos::actions", () => {
  describe("add", () => {
    it("should add value", async () => {
      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { create }
        }
      })
      const content = "Test #123"

      await overmind.actions.todos.add(content)
      expect(overmind.state.todos.list.find(it => overmind.state.todos.items[it].content === content)).toBeTruthy()
    })
    it("should filter out blank values", () => {
      const overmind = createOvermindMock(config)

      expect(overmind.state.todos.list).toHaveLength(0)
      overmind.actions.todos.add(" ")
      expect(overmind.state.todos.list).toHaveLength(0)
    })
  })

  describe("load", () => {
    it("should load", async () => {
      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { getAll }
        }
      })

      await overmind.actions.todos.load()
      overmind.actions.todos.changeVisibility("all")

      expect(overmind.state.todos.list).toEqual(todos.map(it => it.id))
      todos.forEach(todo => expect(overmind.state.todos.items[todo.id]).toEqual(todo))
    })
  })


  const toggleTest = (index: number, initial: boolean, expected: boolean) => {
    return async () => {
      const id = todos[index].id
      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { getAll, update }
        }
      })

      await overmind.actions.todos.load()

      expect(overmind.state.todos.items[id].done).toEqual(initial)

      overmind.actions.todos.toggle(id)

      expect(overmind.state.todos.items[id].done).toEqual(expected)
    }
  }

  describe("toggle", () => {
    it("should change not done to done", toggleTest(0, false, true))
    it("should change done to not done", toggleTest(3, true, false))
  })

  describe("edit", () => {
    it("should edit content", async () => {
      const id = todos[1].id
      const content = "Edited"

      const updateMock: typeof update = jest.fn((todoId: string, patch: TodoPatch) => {
        expect(todoId).toBe(id)
        expect(patch.content).toBe(content)
        return Promise.resolve({...todos.find(it => it.id === id)!, ...patch})
      })
      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { getAll, update: updateMock }
        }
      })

      await overmind.actions.todos.load()
      await overmind.actions.todos.edit({ id, content })

      expect(overmind.state.todos.items[id].content).toBe(content)
    })
  })

  describe("changeDeadline", () => {
    it("should change deadline from null to some", async () => {
      const id = todos[1].id
      const deadline = new Date(new Date().getTime() + 3600)

      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { getAll, update }
        }
      })

      await overmind.actions.todos.load()

      expect(overmind.state.todos.items[id].deadline).toBeNull()

      await overmind.actions.todos.changeDeadline({ id, deadline })

      expect(overmind.state.todos.items[id].deadline).toBe(deadline.toISOString())
    })
  })

  describe("removeDeadline", () => {
    it("should remove deadline", async () => {
      const id = todos[4].id

      const overmind = createOvermindMock(config, {
        toaster: { instance: { showMessage } },
        todos: {
          api: { getAll, update }
        }
      })

      await overmind.actions.todos.load()

      expect(overmind.state.todos.items[id].deadline).toBeTruthy()

      await overmind.actions.todos.removeDeadline(id)

      expect(overmind.state.todos.items[id].deadline).toBeNull()
    })
  })
})
