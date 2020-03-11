import React from "react"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { useApp } from "../../app"
import { User } from "../../app/auth/types"
import { Button } from "@blueprintjs/core"

const UserInformation: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) =>
  <div>
    <span className={styles.text}>Hello, {user.name}!</span>
    <Button small={true} onClick={onLogout} rightIcon="log-out">Log out</Button>
  </div>

const AppHeader: React.FC = () => {
  const { state, actions } = useApp()

  return (
    <Container className={styles.container}>
      {state.auth.user && <UserInformation user={state.auth.user} onLogout={actions.auth.logout} />}
    </Container>
  )
}

export default AppHeader
