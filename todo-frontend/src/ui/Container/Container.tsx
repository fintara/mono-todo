import React from "react"
import classNames from "classnames"
import styles from "./styles.module.scss"

type Props = {
  size?: "small" | "normal" | "full"
  className?: string
}

const Container: React.FC<Props> = ({ size = "normal", className, children }) => {
  return (
    <div className={classNames(styles.container, styles[size], className)}>
      {children}
    </div>
  )
}

export default Container
