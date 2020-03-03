import React from "react"
import styles from "./styles.module.scss"
import { Todo, TodoId } from "../../app/todos/types"
import TodoItem from "../TodoItem"

type Props = {
  items: Todo[]
  onToggle: (id: TodoId) => void
}

const TodosList: React.FC<Props> = ({ items, onToggle }) => {
  return (
    <div className={styles.list}>
      {items.map((item, index) =>
        <TodoItem key={index} item={item} onToggle={() => onToggle(item.id)} />
      )}
    </div>
  )
}

export default TodosList
