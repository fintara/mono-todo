import React from "react"
import styles from "./styles.module.scss"
import { Todo } from "../../app/todos/types"
import classNames from "classnames"
import { Checkbox } from "@blueprintjs/core"

type Props = {
  item: Todo
  onToggle: () => void
}

const TodoItem: React.FC<Props> = ({ item, onToggle }) => {
  return (
    <div className={classNames(styles.item, { [styles.done]: item.done })}>
      <span className={styles.checkboxWrapper}>
        <Checkbox inline={true} className={styles.checkbox} onChange={onToggle} checked={item.done} />
      </span>
      <span className={styles.content}>{item.content}</span>
    </div>
  )
}

export default TodoItem
