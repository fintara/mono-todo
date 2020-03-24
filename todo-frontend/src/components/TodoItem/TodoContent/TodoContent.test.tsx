import React from "react"
import { render, fireEvent } from "@testing-library/react"
import TodoContent from "./TodoContent"
import styles from "./styles.module.scss"

describe("TodoContent", () => {
  const noop = jest.fn()

  it("should be editable if not done", () => {
    const { container } = render(<TodoContent done={false} content={"test"} onConfirm={noop} />)
    expect(container.querySelector(`.${styles.editable}`)).toBeInTheDocument()
  })

  it("should not be editable if done", () => {
    const { container } = render(<TodoContent done={true} content={"test"} onConfirm={noop} />)
    expect(container.querySelector(`.${styles.editable}`)).toBeNull()
  })

  it("should submit changed text", (done) => {
    const old = "test"
    const change = "this is changed"

    const callback = jest.fn((next: string) => {
      expect(next).toEqual(change)
      done()
    })

    const { getByText, container } = render(<TodoContent done={false} content={old} onConfirm={callback} />)

    fireEvent.click(getByText(old))

    const textarea = container.querySelector("textarea")!

    expect(textarea).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: change }})
    fireEvent.blur(textarea)
  })

  it("should not submit empty text", () => {
    const old = "test"

    const callback = jest.fn()

    const { getByText, container } = render(<TodoContent done={false} content={old} onConfirm={callback} />)

    fireEvent.click(getByText(old))

    const textarea = container.querySelector("textarea")!

    expect(textarea).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: "   " }})
    fireEvent.blur(textarea)

    expect(callback).not.toHaveBeenCalled()
  })
})