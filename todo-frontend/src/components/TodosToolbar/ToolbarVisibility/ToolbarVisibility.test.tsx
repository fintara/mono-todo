import React from "react"
import { render, fireEvent } from "@testing-library/react"
import ToolbarVisibility from "./ToolbarVisibility"
import { VisibilityFilter } from "../../../app/todos/types"

describe("ToolbarVisibility", () => {
  it("should be checked when visibility is 'all'", () => {
    const value: VisibilityFilter = "all"
    const noop = jest.fn()

    const { container } = render(<ToolbarVisibility value={value} onChange={noop}/>)

    expect(container.querySelector("input[type=checkbox]")).toHaveAttribute("checked")
  })

  it("should be unchecked when visibility is 'tbd'", () => {
    const value: VisibilityFilter = "tbd"
    const noop = jest.fn()

    const { container } = render(<ToolbarVisibility value={value} onChange={noop}/>)

    expect(container.querySelector("input[type=checkbox]")).not.toHaveAttribute("checked")
  })

  it("should be unchecked when visibility is 'done'", () => {
    const value: VisibilityFilter = "done"
    const noop = jest.fn()

    const { container } = render(<ToolbarVisibility value={value} onChange={noop}/>)

    expect(container.querySelector("input[type=checkbox]")).not.toHaveAttribute("checked")
  })

  it("should update value", (done) => {
    const value: VisibilityFilter = "tbd"
    const change: VisibilityFilter = "all"
    const callback = jest.fn((next: VisibilityFilter) => {
      expect(next).toEqual(change)
      done()
    })

    const { container } = render(<ToolbarVisibility value={value} onChange={callback} />)

    fireEvent.click(container.querySelector("label")!)
  })
})