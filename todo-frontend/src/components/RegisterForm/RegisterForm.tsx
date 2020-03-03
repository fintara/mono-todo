import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@blueprintjs/core"
import styles from "./styles.module.scss"
import Input from "../../ui/Input"
import { Registration } from "../../kt2ts"

type Props = {
  isLoading: boolean
  onSubmit: (form: Registration) => void
}

const RegisterForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, errors } = useForm<Registration>({
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
    error={errors.password?.message}
    inputRef={register({
      required: "Required",
      minLength: {
        value: 5,
        message: "Too short",
      }
    })}
  />

  const Name = <Input
    name="name"
    error={errors.name?.message}
    inputRef={register({
      minLength: {
        value: 2,
        message: "Too short",
      }
    })}
  />

  const Submit = <Button
    type="submit"
    intent="success"
    disabled={isLoading}
    loading={isLoading}
    text="Sign up"
  />

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      {Email}
      {Password}
      {Name}
      {Submit}
    </form>
  )
}

export default RegisterForm
