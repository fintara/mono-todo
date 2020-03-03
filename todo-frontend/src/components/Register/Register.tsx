import React, { useCallback } from "react"
import { Callout, Card, Divider, H2 } from "@blueprintjs/core"
// import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import styles from "../Login/styles.module.scss"
import RegisterForm from "../RegisterForm"
import { urls } from "../../app/router/types"
import { useApp } from "../../app"
import { Registration } from "../../kt2ts"

const Register: React.FC = () => {
  const { state, actions } = useApp()

  const handleSubmit = useCallback((form: Registration) => {
    actions.auth.register(form)
  }, [actions.auth])

  return (
    <Container size="small">
      <Card elevation={3}>
        <H2>Sign up</H2>

        {state.auth.mode.current === "error" &&
        <Callout className={styles.error} intent="danger">{state.auth.error}</Callout>}

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={state.auth.mode.current === "registering"}
        />

        <Divider className={styles.divider} />

        Already have an account? <a href={urls.login}>Log in</a>!
      </Card>
    </Container>
  )
}

export default Register
