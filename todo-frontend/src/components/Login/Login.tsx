import React, { useCallback } from "react"
import { Callout, Card, Divider, H2 } from "@blueprintjs/core"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { useApp } from "../../app"
import LoginForm from "../LoginForm"
import { urls } from "../../app/router/types"
import { Credentials } from "../../kt2ts"

const Login: React.FC = () => {
  const { state, actions } = useApp()

  const handleSubmit = useCallback((credentials: Credentials) => {
    actions.auth.login(credentials)
  }, [actions.auth])

  return (
    <Container size="small">
      <Card elevation={3}>
        <H2>Log in</H2>

        {state.auth.mode.current === "error" &&
          <Callout className={styles.error} intent="danger">{state.auth.error}</Callout>}

        <LoginForm
          onSubmit={handleSubmit}
          isLoading={state.auth.mode.current === "authenticating"}
        />

        <Divider className={styles.divider} />

        Don't have an account? <a href={urls.register}>Sign up</a>!
      </Card>
    </Container>
  )
}

export default Login
