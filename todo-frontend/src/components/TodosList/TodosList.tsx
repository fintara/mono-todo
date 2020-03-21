import React from "react"
import styles from "./styles.module.scss"
import { TodoId } from "../../app/todos/types"
import TodoItem from "../TodoItem"
import { useApp } from "../../app"

type Props = {
  items: TodoId[]
  disabled: TodoId[]
  onToggle: (id: TodoId) => void
  onEdit: (id: TodoId, content: string) => void
  onDeadlineChange: (id: TodoId, deadline: Date) => void
  onDeadlineRemove: (id: TodoId) => void
  onRemove: (id: TodoId) => void
}

const TodosList: React.FC<Props> = ({ items, disabled, onToggle, onEdit, onDeadlineChange, onDeadlineRemove, onRemove }) => {
  const { state } = useApp()

  return (
    <div className={styles.list}>
      {items.map((id) =>
        <TodoItem
          key={id}
          disabled={disabled.includes(id)}
          item={state.todos.items[id]}
          onToggle={() => onToggle(id)}
          onEdit={content => onEdit(id, content)}
          onDeadlineChange={deadline => onDeadlineChange(id, deadline)}
          onDeadlineRemove={() => onDeadlineRemove(id)}
          onRemove={() => onRemove(id)}
        />
      )}
    </div>
  )
}

export default TodosList
