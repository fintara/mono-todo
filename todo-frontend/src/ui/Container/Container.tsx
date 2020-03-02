import React from "react"
import classNames from "classnames"
import styles from "./styles.module.scss"

type Props = {
  size?: "small" | "normal" | "full"
}

const Container: React.FC<Props> = ({ size = "normal", children }) => {
  return (
    <div className={classNames(styles.container, styles[size])}>
      {children}
    </div>
  )
}

export default Container
