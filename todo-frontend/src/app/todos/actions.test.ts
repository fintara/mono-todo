import { createOvermindMock } from "overmind"
import { config } from "../index"
import { Api, Todo, TodoCreate } from "./types"

const todos = [
  { id: "aaaaa", content: "Abc", done: false },
  { id: "bbbbb", content: "Def", done: false },
  { id: "ccccc", content: "Xyz", done: false },
  { id: "ddddd", content: "Qwe", done: true },
  { id: "eeeee", content: "Uvw", done: false },
]

const dummyApi: Api = new class implements Api {
  authenticate(token: string | null): void {
  }

  create(todo: TodoCreate): Promise<Todo> {
    return Promise.resolve({ id: new Date().toUTCString(), done: false, ...todo })
  }

  delete(id: string): Promise<void> {
    return Promise.resolve()
  }

  getAll(): Promise<Todo[]> {
    return Promise.resolve(todos)
  }

  update(id: string, patch: Partial<Omit<Todo, "id">>): Promise<Todo> {
    const todo = todos.find(it => it.id === id)
    if (!todo) {
      return Promise.reject()
    }
    return Promise.resolve({...todo, ...patch})
  }
}()

describe("todos::actions", () => {
  describe("add", () => {
    it("should add value", async () => {
      const overmind = createOvermindMock(config, {
        todos: {
          api: dummyApi
        }
      })
      const content = "Test #123"

      await overmind.actions.todos.add(content)
      expect(overmind.state.todos.list.find(it => it.content === content)).toBeTruthy()
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
        todos: {
          api: dummyApi
        }
      })

      await overmind.actions.todos.load()

      expect(overmind.state.todos.list).toEqual(todos)
      todos.forEach(todo => expect(overmind.state.todos.items[todo.id]).toEqual(todo))
    })
  })

  describe("toggle", () => {
    it("should change done to not done", toggleTest(true, false))
    it("should change not done to done", toggleTest(false, true))
  })
})

function toggleTest(initial: boolean, expected: boolean) {
  return async () => {
    const id = todos[3].id
    const overmind = createOvermindMock(config, {
      todos: {
        api: dummyApi
      }
    })

    await overmind.actions.todos.load()

    expect(overmind.state.todos.items[id].done).toEqual(initial)

    overmind.actions.todos.toggle(id)

    expect(overmind.state.todos.items[id].done).toEqual(expected)
  }
}