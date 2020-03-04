import React, { ChangeEvent, useCallback, useState } from "react"
// import styles from "./styles.module.scss"
import { Button, InputGroup } from "@blueprintjs/core"

type Props = {
  onSubmit: (value: string) => void
}

const TodoInput: React.FC<Props> = ({ onSubmit }) => {

  const [value, setValue] = useState("")

  const handleSubmit = useCallback((value: string) => {
    onSubmit(value)
    setValue("")
  }, [onSubmit])

  return (
    <InputGroup
      large={true}
      rightElement={<Button minimal={true} icon="key-enter" onClick={() => handleSubmit(value)} />}
      placeholder="Remind me to..."
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      onKeyUp={(e) => e.keyCode === 13 && handleSubmit(value)}
    />
  )
}

export default TodoInput
