import React, { useCallback, useState } from "react"
import { EditableText } from "@blueprintjs/core"
import classNames from "classnames"
import styles from "./styles.module.scss"

type ContentProps
  = Pick<Props, "content" | "className">
  & { onClick: (() => void) | null }

const Content: React.FC<ContentProps> = ({ content, onClick, className }) => (
  <span
    className={classNames(className, styles.readOnly, { [styles.editable]: !!onClick })}
    title={content.length > 85 ? content : undefined}
    onClick={() => onClick && onClick()}
  >
    {content}
  </span>
)

type EditableProps
  = Omit<Props, "done">
  & { onCancel: () => void }

const Editable: React.FC<EditableProps> = ({ content, onConfirm, onCancel, className }) => {
  const [value, setValue] = useState(content)

  const handleBlur = useCallback((next: string) => {
    if (!next.trim()) {
      setValue(content)
      onCancel()
      return
    }
    onConfirm(next.trim())
  }, [content, onConfirm, onCancel])

  return <EditableText
    isEditing={true}
    value={value}
    onChange={setValue}
    onConfirm={handleBlur}
    onCancel={onCancel}
    multiline={true}
    className={classNames(className, styles.textbox)}
  />
}

type Props = {
  done: boolean
  content: string
  onConfirm: (value: string) => void
  className?: string
}

const TodoContent: React.FC<Props> = ({ done, onConfirm, ...rest }) => {
  const [editable, setEditable] = useState(false)

  const handleConfirm = useCallback((value: string) => {
    setEditable(false)
    onConfirm(value)
  }, [onConfirm])

  return editable
    ? <Editable {...rest} onConfirm={handleConfirm} onCancel={() => setEditable(false)} />
    : <Content {...rest} onClick={done ? null : () => setEditable(!done) } />
}

export default TodoContent
