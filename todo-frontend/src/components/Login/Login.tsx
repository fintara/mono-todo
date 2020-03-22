import React, { useCallback } from "react"
import { Callout, Card, Divider, H2 } from "@blueprintjs/core"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { useApp } from "../../app"
import LoginForm from "../LoginForm"
import { urls } from "../../app/router/types"
import { Credentials } from "../../app/auth/types"

const Login: React.FC = () => {
  const { state, actions } = useApp()

  const handleSubmit = useCallback((credentials: Credentials) => {
    actions.auth.login(credentials)
  }, [actions.auth])

  return (
    <Container size="small" className={styles.container}>
      <Card elevation={3}>
        <H2 className={styles.header}>Log in</H2>

        {state.auth.mode.current === "error" &&
          <Callout className={styles.callout} intent="danger">{state.auth.error}</Callout>}

        {state.auth.mode.current === "registered" &&
          <Callout className={styles.callout} intent="success">
            You've signed up successfully!
            Use your credentials to log in now.
          </Callout>}

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
