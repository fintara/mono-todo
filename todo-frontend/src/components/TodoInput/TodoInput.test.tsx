import React from "react"
import { render, fireEvent } from "@testing-library/react"
import TodoInput from "./TodoInput"

const ENTER = {
  key: "Enter",
  code: "Enter",
  which: 13,
  keyCode: 13,
}

describe("TodoInput", () => {
  it("should submit on Enter", async () => {
    const callback = jest.fn()
    const { getByPlaceholderText } = render(<TodoInput onSubmit={callback} />)

    const input = getByPlaceholderText("Remind me to...")
    fireEvent.keyUp(input, ENTER)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})