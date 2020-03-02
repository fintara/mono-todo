import React from "react"
import { FormGroup, InputGroup } from "@blueprintjs/core"
import { capitalize } from "../../app/common/utils"
// import styles from "./styles.module.scss"

export type Props = {
  id?: string
  name: string
  label?: string
  info?: string
  placeholder?: string
  type?: HTMLInputElement["type"]
  hasErrors?: boolean
  error?: string
  inputRef?: (el: HTMLInputElement | null) => void
}

const Input: React.FC<Props> = (
  {
    type = "text",
    name,
    id = name,
    label = capitalize(name),
    error,
    hasErrors = !!error,
    inputRef,
    ...rest
  }) => (
  <FormGroup
    label={label}
    labelFor={id}
    labelInfo={rest.info}
    helperText={error}
    intent={(hasErrors) ? "danger" : "none"}
  >
    <InputGroup
      id={id}
      name={name}
      intent={(hasErrors) ? "danger" : "none"}
      type={type}
      placeholder={rest.placeholder}
      inputRef={inputRef}
    />
  </FormGroup>
)

export default Input