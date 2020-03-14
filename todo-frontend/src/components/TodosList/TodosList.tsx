import React from "react"
import styles from "./styles.module.scss"
import { TodoId } from "../../app/todos/types"
import TodoItem from "../TodoItem"
import { useApp } from "../../app"

type Props = {
  items: TodoId[]
  onToggle: (id: TodoId) => void
  onEdit: (id: TodoId, content: string) => void
  onDeadlineChange: (id: TodoId, deadline: Date) => void
  onDeadlineRemove: (id: TodoId) => void
}

const TodosList: React.FC<Props> = ({ items, onToggle, onEdit, onDeadlineChange, onDeadlineRemove }) => {
  const { state } = useApp()

  return (
    <div className={styles.list}>
      {items.map((id) =>
        <TodoItem
          key={id}
          item={state.todos.items[id]}
          onToggle={() => onToggle(id)}
          onEdit={content => onEdit(id, content)}
          onDeadlineChange={deadline => onDeadlineChange(id, deadline)}
          onDeadlineRemove={() => onDeadlineRemove(id)}
        />
      )}
    </div>
  )
}

export default TodosList
