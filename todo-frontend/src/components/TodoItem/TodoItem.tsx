import React, { useCallback, useState } from "react"
import styles from "./styles.module.scss"
import { Todo } from "../../app/todos/types"
import classNames from "classnames"
import { Checkbox, EditableText } from "@blueprintjs/core"

type Props = {
  item: Todo
  onToggle: () => void
  onEdit: (content: string) => void
}

const TodoItem: React.FC<Props> = ({ item, onToggle, onEdit }) => {
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
          multiline={false}
          value={content}
          onChange={setContent}
          onConfirm={handleEdit}
        />}
    </div>
  )
}

export default TodoItem
