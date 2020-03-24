import React from "react"
import { render, fireEvent } from "@testing-library/react"
import ToolbarSize from "./ToolbarSize"
import { SizeFilter } from "../../../app/todos/types"

describe("ToolbarSize", () => {
  it("should show current value", () => {
    const value: SizeFilter = 10
    const noop = jest.fn()

    const { getByText } = render(<ToolbarSize value={value} onChange={noop}/>)

    expect(getByText(`${value} items`)).toBeInTheDocument()
  })

  it("should update value", (done) => {
    const value: SizeFilter = 10
    const change: SizeFilter = 25
    const callback = jest.fn((next: SizeFilter) => {
      expect(next).toEqual(change)
      done()
    })

    const { getByText } = render(<ToolbarSize value={value} onChange={callback} />)

    fireEvent.click(getByText(`${value} items`))
    fireEvent.click(getByText(`${change} items`))
  })
})