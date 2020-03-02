import React from "react"
import { Card, H1 } from "@blueprintjs/core"
import Container from "../../ui/Container"
import styles from "./styles.module.scss"
import { urls } from "../../app/router/types"

const Home: React.FC = () => {
  return (
    <Container>
      <Card
        elevation={3}
      >
        <H1 className={styles.headerText}>Mono Todo</H1>

        <p className={styles.text}>
          Welcome to the latest and greatest todo service where you will never forget to do your tasks!
        </p>

        <p className={styles.text}>
          In order to proceed, please
          {' '}
          <a href={urls.register}>sign up</a>
          {' '}
          or, if you already have an account,
          {' '}
          <a href={urls.login}>log in</a>
          .
        </p>
      </Card>
    </Container>
  )
}

export default Home
