import React from "react"
import { Provider } from "overmind-react"
import { render, fireEvent, getByText } from "@testing-library/react"
import TodosToolbar from "./TodosToolbar"
import { createOvermindMock } from "overmind"
import { config } from "../../app"

describe("ToolbarDue", () => {
  const getByPartialText = (container: any, text: string) => getByText(container, text, { exact: false })
  const overmind = createOvermindMock(config)

  it("should show visibility filter", () => {
    const { container } = render(<Provider value={overmind}><TodosToolbar /></Provider>)
    expect(getByPartialText(container, "show done")).toBeInTheDocument()
  })

  it("should show due filter", () => {
    const { container } = render(<Provider value={overmind}><TodosToolbar /></Provider>)
    expect(getByPartialText(container, "due")).toBeInTheDocument()
  })
})