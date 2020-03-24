import React from "react"
import { render, fireEvent } from "@testing-library/react"
import ToolbarDue from "./ToolbarDue"
import { DueFilter } from "../../../app/todos/types"

describe("ToolbarDue", () => {
  it("should show current value", () => {
    const value: DueFilter = "next week"
    const noop = jest.fn()

    const { getByText } = render(<ToolbarDue value={value} onChange={noop}/>)

    expect(getByText(value)).toBeInTheDocument()
  })

  it("should update value", (done) => {
    const value: DueFilter = "off"
    const change: DueFilter = "next week"
    const callback = jest.fn((next: DueFilter) => {
      expect(next).toEqual(change)
      done()
    })

    const { getByText } = render(<ToolbarDue value={value} onChange={callback} />)

    fireEvent.click(getByText(value))
    fireEvent.click(getByText(change))
  })
})