import React from "react"
import { render, fireEvent, getByText } from "@testing-library/react"
import TodoDeadline from "./TodoDeadline"
import styles from "./styles.module.scss"

describe("TodoDeadline", () => {
  const date = new Date()
  const noop = jest.fn()

  it("should show empty deadline when not done", () => {
    const { getByText } = render(<TodoDeadline done={false} current={null} minDate={date} onChange={noop} onRemove={noop} />)
    expect(getByText("no deadline")).toBeInTheDocument()
  })

  it("should not show deadline when empty and done", () => {
    const { container } = render(<TodoDeadline done={true} current={null} minDate={date} onChange={noop} onRemove={noop} />)
    expect(container.querySelector("button")).not.toBeInTheDocument()
  })

  const testLabel = (current: Date, expectedLabel: string) => {
    const { container } = render(<TodoDeadline done={false} current={current.toISOString()} minDate={date} onChange={noop} onRemove={noop} />)

    const element = getByText(container, expectedLabel, {
      exact: false
    })

    expect(element).toBeInTheDocument()
  }

  it("should show 'yesterday' when deadline is yesterday", () => {
    const yesterday = new Date(date.getTime() - 3600 * 24 * 1000)
    testLabel(yesterday, "yesterday")
  })

  it("should show 'today' when deadline is today", () => {
    testLabel(date, "today")
  })

  it("should show 'tomorrow' when deadline is tomorrow", () => {
    const tomorrow = new Date(date.getTime() + 3600 * 24 * 1000)
    testLabel(tomorrow, "tomorrow")
  })

  it("should remove deadline", () => {
    const callback = jest.fn()

    const { container } = render(<TodoDeadline done={false} current={date.toISOString()} minDate={date} onChange={noop} onRemove={callback} />)

    fireEvent.click(container.querySelector("button:nth-child(2)")!)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})