import React from "react"
import styles from "./styles.module.scss"
import { useApp } from "../../app"
import ToolbarSize from "./ToolbarSize"
import ToolbarDue from "./ToolbarDue"
import ToolbarVisibility from "./ToolbarVisibility"

const TodosToolbar: React.FC = () => {
  const { state, actions } = useApp()

  return (
    <div className={styles.container}>

      <ToolbarDue value={state.todos.dueFilter} onChange={actions.todos.changeDue} />

      {/*<ToolbarSize value={state.todos.pageSize} onChange={actions.todos.changeSize} />*/}

      <ToolbarVisibility value={state.todos.visibility} onChange={actions.todos.changeVisibility} />

    </div>
  )
}

export default TodosToolbar
