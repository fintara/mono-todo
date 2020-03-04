import { createOvermindMock } from "overmind"
import { config } from "../index"
import { Todo } from "./types"

describe("todos::actions", () => {
  describe("add", () => {
    it("should add value", () => {
      const overmind = createOvermindMock(config)
      const content = "Test #123"

      overmind.actions.todos.add(content)
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
      const todos: Todo[] = [
        { id: "aaa", content: "First", done: true },
        { id: "bbb", content: "Second", done: false },
        { id: "ccc", content: "Third", done: false },
      ]
      const overmind = createOvermindMock(config, {
        todos: {
          api: {
            getTodos(): Promise<Todo[]> {
              return Promise.resolve(todos)
            }
          }
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
    const id = "xyz"
    const overmind = createOvermindMock(config, {
      todos: {
        api: {
          getTodos(): Promise<Todo[]> {
            return Promise.resolve([{ id, content: "test", done: initial }])
          }
        }
      }
    })

    await overmind.actions.todos.load()

    expect(overmind.state.todos.items[id].done).toEqual(initial)

    overmind.actions.todos.toggle(id)

    expect(overmind.state.todos.items[id].done).toEqual(expected)
  }
}