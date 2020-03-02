import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@blueprintjs/core"
import styles from "./styles.module.scss"
import { Credentials } from "../../app/auth/types"
import Input from "../../ui/Input"

type Props = {
  isLoading: boolean
  onSubmit: (credentials: Credentials) => void
}

const LoginForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, errors } = useForm<Credentials>({
    submitFocusError: false,
  })

  const Email = <Input
    name="email"
    label="E-mail"
    placeholder="john@gmail.com"
    error={errors.email?.message}
    inputRef={register({
      required: "Required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: "Invalid email address"
      }
    })}
  />

  const Password = <Input
    type="password"
    name="password"
    label="Password"
    error={errors.password?.message}
    inputRef={register({
      required: "Required",
      minLength: {
        value: 5,
        message: "Too short"
      }
    })}
  />

  const Submit = <Button
    id="submit"
    type="submit"
    intent="success"
    disabled={isLoading}
    loading={isLoading}
    text="Log in"
  />

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      {Email}
      {Password}
      {Submit}
    </form>
  )
}

export default LoginForm
