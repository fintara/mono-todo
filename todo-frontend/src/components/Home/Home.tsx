import React from "react"
import { AnchorButton, Card, H1 } from "@blueprintjs/core"
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
          <AnchorButton
            href={urls.register}
            outlined={false}
            icon="book"
            small={true}>sign up</AnchorButton>
          {' '}
          or, if you already have an account,
          {' '}
          <AnchorButton
            href={urls.login}
            outlined={false}
            icon="log-in"
            small={true}>log in</AnchorButton>
          .
        </p>
      </Card>
    </Container>
  )
}

export default Home
