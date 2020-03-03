import React from "react"
import styles from "./styles.module.scss"
import { Page } from "../../app/router/types"
import { useApp } from "../../app"
import Home from "../Home"
import Login from "../Login"
import Register from "../Register"
import Todos from "../Todos"
import Error404 from "../Error404"

const pagesDictionary: { [page in Page]: React.FC } = {
  "home": Home,
  "login": Login,
  "register": Register,
  "todos": Todos,
  "error_404": Error404,
}

const App: React.FC = () => {
  const { state } = useApp()

  const PageComponent = pagesDictionary[state.router.page]

  return (
    <div className={styles.container}>
      <PageComponent />
    </div>
  )
}

export default App
