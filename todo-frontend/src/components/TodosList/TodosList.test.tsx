import React from "react"
import { Provider } from "overmind-react"
import { render, fireEvent, getByText } from "@testing-library/react"
import TodosList from "./TodosList"
import { createOvermindMock } from "overmind"
import { config } from "../../app"
import { Todo, TodoId } from "../../app/todos/types"
import styles from "./styles.module.scss"

const date = new Date().getTime()
const todos: Todo[] = [
  { id: "aaaaa", content: "Abc", done: false , deadline: null, createdAt: new Date(date + 3) },
  { id: "bbbbb", content: "Def", done: false , deadline: null, createdAt: new Date(date + 2) },
  { id: "ccccc", content: "Xyz", done: true , deadline: null, createdAt: new Date(date + 1) },
]

describe("TodosList", () => {
  const noop = jest.fn()
  const overmind = createOvermindMock(config, {
    todos: {
      api: {
        getAll(): Promise<Todo[]> {
          return Promise.resolve([...todos])
        },
      },
    },
  })

  it("should show all todos", async () => {
    await overmind.actions.todos.load()

    const { container } = render(<Provider value={overmind}>
      <TodosList
        disabled={[]}
        onRemove={noop}
        onDeadlineRemove={noop}
        onDeadlineChange={noop}
        onEdit={noop}
        onToggle={noop}
        items={todos.map(it => it.id)}
      />
    </Provider>)

    expect(container.querySelectorAll(`.${styles.list} > div`)!.length).toEqual(todos.length)
  })

  it("should propagate onToggle", async (done) => {
    const callback = jest.fn((id: TodoId) => {
      expect(id).toEqual(todos[0].id)
      done()
    })

    await overmind.actions.todos.load()

    const { container } = render(<Provider value={overmind}>
      <TodosList
        disabled={[]}
        onRemove={noop}
        onDeadlineRemove={noop}
        onDeadlineChange={noop}
        onEdit={noop}
        onToggle={callback}
        items={todos.map(it => it.id)}
      />
    </Provider>)

    fireEvent.click(container.querySelector(`.${styles.list} > div:first-child input[type=checkbox]`)!)
  })

  it("should propagate onRemove", async (done) => {
    const callback = jest.fn((id: TodoId) => {
      expect(id).toEqual(todos[0].id)
      done()
    })

    await overmind.actions.todos.load()

    const { container } = render(<Provider value={overmind}>
      <TodosList
        disabled={[]}
        onRemove={callback}
        onDeadlineRemove={noop}
        onDeadlineChange={noop}
        onEdit={noop}
        onToggle={noop}
        items={todos.map(it => it.id)}
      />
    </Provider>)

    fireEvent.click(container.querySelector(`.${styles.list} > div:first-child .bp3-icon-trash`)!)
  })
})