import React from "react"
import { AnchorButton, NonIdealState } from "@blueprintjs/core"
import styles from "./styles.module.scss"

const Error404: React.FC = () => {
  return (
    <NonIdealState
      className={styles.container}
      icon="path-search"
      title="Page not found"
      description="Are you sure this is the correct link?"
      action={<AnchorButton text="Go to home" href="/" />}
    />
  )
}

export default Error404
