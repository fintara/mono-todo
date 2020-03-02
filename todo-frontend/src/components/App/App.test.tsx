import React from "react"
import { render } from "@testing-library/react"
import App from "./index"
import { createOvermindMock } from "overmind"
import { config } from "../../app"
import { Provider } from "overmind-react"

const setup = () => {
  const overmind = createOvermindMock(config)
  return <Provider value={overmind}><App /></Provider>
}

test("renders home", () => {
  const { getByText } = render(setup())
  const element = getByText(/Mono Todo/i)
  expect(element).toBeInTheDocument()
})
