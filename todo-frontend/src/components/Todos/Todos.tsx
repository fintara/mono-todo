import React from "react"
// import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { Card } from "@blueprintjs/core"
import { useApp } from "../../app"
import TodosList from "../TodosList"

const Todos: React.FC = () => {
  const { state, actions } = useApp()

  return (
    <Container size="normal">
      <Card elevation={3}>

        <TodosList
          items={state.todos.list}
          onToggle={actions.todos.toggle}
        />

      </Card>
    </Container>
  )
}

export default Todos
