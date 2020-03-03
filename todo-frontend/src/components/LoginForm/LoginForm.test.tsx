import React from "react"
import { render, act, fireEvent, queryByAttribute } from "@testing-library/react"
import LoginForm from "./LoginForm"
import { Credentials } from "../../kt2ts"

const queryById = queryByAttribute.bind(null, "id")

test("submits values", async (done) => {
  const email = "test@gmail.com"
  const password = "ver1s3cr3t"

  const callback = (credentials: Credentials) => {
    expect(credentials.email).toBe(email)
    expect(credentials.password).toBe(password)

    done()
  }

  const { container } = render(<LoginForm isLoading={false} onSubmit={callback} />)

  await act(async () => {
    fireEvent.change(
      queryById(container, "email")!,
      { target: { value: email } },
    )

    fireEvent.change(
      queryById(container, "password")!,
      { target: { value: password } },
    )

    fireEvent.click(queryById(container, "submit")!)
  })
})
