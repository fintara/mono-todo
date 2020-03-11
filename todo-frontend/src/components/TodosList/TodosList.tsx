import React from "react"
import styles from "./styles.module.scss"
import { Todo, TodoId } from "../../app/todos/types"
import TodoItem from "../TodoItem"

type Props = {
  items: Todo[]
  onToggle: (id: TodoId) => void
  onEdit: (id: TodoId, content: string) => void
}

const TodosList: React.FC<Props> = ({ items, onToggle, onEdit }) => {
  return (
    <div className={styles.list}>
      {items.map((item, index) =>
        <TodoItem
          key={index}
          item={item}
          onToggle={() => onToggle(item.id)}
          onEdit={(content => onEdit(item.id, content))}
        />
      )}
    </div>
  )
}

export default TodosList
