import React from "react"
import { render, act, fireEvent, queryByAttribute } from "@testing-library/react"
import RegisterForm from "./RegisterForm"
import { Registration } from "../../app/auth/types"

const queryById = queryByAttribute.bind(null, "id")

describe("RegisterForm", () => {
  it("should submit values", async (done) => {
    const email = "test@gmail.com"
    const password = "ver1s3cr3t"
    const name = "John"

    const callback = jest.fn((form: Registration) => {
      expect(form.email).toBe(email)
      expect(form.password).toBe(password)
      expect(form.name).toBe(name)

      done()
    })

    const { container } = render(<RegisterForm isLoading={false} onSubmit={callback} />)

    await act(async () => {
      fireEvent.change(
        queryById(container, "email")!,
        { target: { value: email } },
      )

      fireEvent.change(
        queryById(container, "password")!,
        { target: { value: password } },
      )

      fireEvent.change(
        queryById(container, "name")!,
        { target: { value: name } },
      )

      fireEvent.click(queryById(container, "submit")!)
    })
  })
})
