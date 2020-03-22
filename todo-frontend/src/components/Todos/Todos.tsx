import React, { useCallback, useState } from "react"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { Alert, Card } from "@blueprintjs/core"
import { useApp } from "../../app"
import TodosList from "../TodosList"
import TodoInput from "../TodoInput"
import { TodoId } from "../../app/todos/types"
import TodosToolbar from "../TodosToolbar"

const Todos: React.FC = () => {
  const { state, actions } = useApp()

  const [isRemoving, setRemoving] = useState<TodoId | null>(null)

  const handleConfirmRemove = useCallback(() => {
    if (!isRemoving) return
    actions.todos.remove(isRemoving)
    setRemoving(null)
  }, [actions.todos, isRemoving])

  return (
    <Container size="normal" className={styles.container}>

      <TodosToolbar />

      <Card elevation={3}>

        <div className={styles.input}>
          <TodoInput
            onSubmit={actions.todos.add}
          />
        </div>

        <TodosList
          items={state.todos.list}
          disabled={state.todos.disabled}
          onToggle={actions.todos.toggle}
          onEdit={(id, content) => actions.todos.edit({ id, content })}
          onDeadlineChange={(id, deadline) => actions.todos.changeDeadline({ id, deadline })}
          onDeadlineRemove={actions.todos.removeDeadline}
          onRemove={setRemoving}
        />

        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Remove"
          icon="trash"
          intent="danger"
          isOpen={isRemoving != null}
          onCancel={() => setRemoving(null)}
          onConfirm={handleConfirmRemove}
        >
          {isRemoving && <>Are you sure you want to remove "{state.todos.items[isRemoving].content}"?</>}
        </Alert>

      </Card>
    </Container>
  )
}

export default Todos
