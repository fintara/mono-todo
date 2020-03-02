import React from "react"
import { render } from "@testing-library/react"
import App from "./index"

test("renders learn react link", () => {
  const { getByText } = render(<App/>)
  const element = getByText(/Hi/i)
  expect(element).toBeInTheDocument()
})
