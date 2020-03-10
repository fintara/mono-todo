import React, { useCallback } from "react"
import styles from "./styles.module.scss"
import Container from "../../ui/Container"
import { useApp } from "../../app"
import { User } from "../../app/auth/types"
import { Button } from "@blueprintjs/core"

const UserInformation: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => {
  const callback =  useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    onLogout()
  }, [onLogout])

  return <div>
    <span>Hello, {user.name}!</span>
    {' '}
    <a href="#" onClick={callback}>Log out</a>
  </div>
}

const AppHeader: React.FC = () => {
  const { state, actions } = useApp()

  return (
    <Container className={styles.container}>
      {state.auth.user && <UserInformation user={state.auth.user} onLogout={actions.auth.logout} />}
    </Container>
  )
}

export default AppHeader
