import React, { useCallback, useState } from "react"
import { Checkbox, EditableText } from "@blueprintjs/core"
import classNames from "classnames"
import styles from "./styles.module.scss"
import { Todo } from "../../app/todos/types"
import TodoDeadline from "../TodoDeadline"

type Props = {
  item: Todo,
  onToggle: () => void
  onEdit: (content: string) => void
  onDeadlineChange: (deadline: Date) => void
  onDeadlineRemove: () => void
}

const TodoItem: React.FC<Props> = ({ item, onToggle, onEdit, onDeadlineChange, onDeadlineRemove }) => {
  const [content, setContent] = useState(item.content)

  const handleEdit = useCallback((content: string) => {
    if (!content.trim()) {
      setContent(item.content)
      return
    }
    onEdit(content.trim())
  }, [item.content, setContent, onEdit])

  return (
    <div className={classNames(styles.item, { [styles.done]: item.done })}>
      <span className={styles.checkboxWrapper}>
        <Checkbox
          className={styles.checkbox}
          inline={true}
          checked={item.done}
          onChange={onToggle}
        />
      </span>
      {item.done
        ? <span className={styles.content}>{content}</span>
        : <EditableText
            className={styles.content}
            minWidth={10}
            multiline={false}
            value={content}
            onChange={setContent}
            onConfirm={handleEdit}
        />}
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
  )
}

export default TodoItem
