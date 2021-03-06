import React from "react"
import { render } from "@testing-library/react"
import { Todo } from "../../app/todos/types"
import TodoItem from "./TodoItem"
import styles from "./styles.module.scss"

const noop = jest.fn()

describe("TodoItem", () => {
  it("should not be editable when todo is done", () => {
    const todo: Todo = { id: "xxx", content: "test xyz abc", deadline: null, done: true, createdAt: new Date() }

    const { getByText } = render(<TodoItem
      item={todo}
      disabled={false}
      onToggle={noop}
      onEdit={noop}
      onDeadlineChange={noop}
      onDeadlineRemove={noop}
      onRemove={noop}
    />)

    expect(getByText(todo.content)).toHaveClass(styles.content)
  })

  it("should be editable when todo is not done", () => {
    const todo: Todo = { id: "xxx", content: "test xyz abc", deadline: null, done: false, createdAt: new Date() }

    const { getByText } = render(<TodoItem
      item={todo}
      disabled={false}
      onToggle={noop}
      onEdit={noop}
      onDeadlineChange={noop}
      onDeadlineRemove={noop}
      onRemove={noop}
    />)

    expect(getByText(todo.content)).toHaveClass("editable")
  })
})