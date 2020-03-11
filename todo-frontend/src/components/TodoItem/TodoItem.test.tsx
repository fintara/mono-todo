import React from "react"
import { render } from "@testing-library/react"
import { Todo } from "../../app/todos/types"
import TodoItem from "./TodoItem"
import styles from "./styles.module.scss"

const noop: (...any: any) => any = () => {}

describe("TodoItem", () => {
  it("should not be editable when todo is done", () => {
    const todo: Todo = { id: "xxx", content: "test xyz abc", done: true }

    const { getByText } = render(<TodoItem item={todo} onToggle={noop} onEdit={noop} />)

    expect(getByText(todo.content)).toHaveClass(styles.content)
  })

  it("should be editable when todo is not done", () => {
    const todo: Todo = { id: "xxx", content: "test xyz abc", done: false }

    const { getByText } = render(<TodoItem item={todo} onToggle={noop} onEdit={noop} />)

    expect(getByText(todo.content)).toHaveClass("bp3-editable-text-content")
  })
})