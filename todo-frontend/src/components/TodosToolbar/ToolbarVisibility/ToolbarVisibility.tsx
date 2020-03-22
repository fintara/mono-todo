import React from "react"
import { Switch } from "@blueprintjs/core"
import { VisibilityFilter } from "../../../app/todos/types"
import { Props } from "../types"
import ownStyles from "./styles.module.scss"
import styles from "../styles.module.scss"

const ToolbarVisibility: React.FC<Props<VisibilityFilter>> = ({ value, onChange }) => {
  return (
    <div>
      show done <span className={styles.action}>
      <Switch
        className={ownStyles.label}
        inline={true}
        size={8}
        checked={value === "all"}
        onChange={() => onChange(value === "all" ? "tbd" : "all")}
      />
    </span>
    </div>
  )
}

export default ToolbarVisibility
