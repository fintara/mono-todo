import React from "react"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { Card } from "@blueprintjs/core"
import { useApp } from "../../app"
import TodosList from "../TodosList"
import TodoInput from "../TodoInput"

const Todos: React.FC = () => {
  const { state, actions } = useApp()

  return (
    <Container size="normal" className={styles.container}>
      <Card elevation={3}>

        <div className={styles.input}>
          <TodoInput
            onSubmit={actions.todos.add}
          />
        </div>

        <TodosList
          items={state.todos.list}
          onToggle={actions.todos.toggle}
          onEdit={((id, content) => actions.todos.edit({ id, content }))}
        />

      </Card>
    </Container>
  )
}

export default Todos
