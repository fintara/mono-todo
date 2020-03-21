import React from "react"
import { Button, Checkbox } from "@blueprintjs/core"
import classNames from "classnames"
import styles from "./styles.module.scss"
import { Todo } from "../../app/todos/types"
import TodoDeadline from "../TodoDeadline"
import TodoContent from "../TodoContent"

type Props = {
  item: Todo,
  disabled: boolean,
  onToggle: () => void
  onEdit: (content: string) => void
  onDeadlineChange: (deadline: Date) => void
  onDeadlineRemove: () => void
  onRemove: () => void
}

const TodoItem: React.FC<Props> = ({ item, disabled, onToggle, onEdit, onDeadlineChange, onDeadlineRemove, onRemove }) => {
  return (
    <div className={classNames(styles.item, { [styles.disabled]: disabled, [styles.done]: item.done })}>
      <span className={styles.checkboxWrapper}>
        <Checkbox
          className={styles.checkbox}
          inline={true}
          checked={item.done}
          onChange={onToggle}
        />
      </span>
      <div className={styles.body}>
        <TodoContent
          done={item.done}
          content={item.content}
          onConfirm={onEdit}
          className={styles.content}
        />
        <span className={styles.deadlineWrapper}>
          <TodoDeadline
            done={item.done}
            current={item.deadline}
            minDate={item.createdAt}
            onChange={onDeadlineChange}
            onRemove={onDeadlineRemove}
          />
        </span>
      </div>
      <span className={styles.removeWrapper}>
        <Button
          minimal={true}
          icon="trash"
          small={true}
          onClick={onRemove}
        />
      </span>
    </div>
  )
}

export default TodoItem
