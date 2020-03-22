import React from "react"
import { Icon, Menu, MenuItem, Popover } from "@blueprintjs/core"
import styles from "../styles.module.scss"
import { DueFilter, dueFilters } from "../../../app/todos/types"
import { Props } from "../types"

const ToolbarDue: React.FC<Props<DueFilter>> = ({ value, onChange }) => {
  return (
    <div>
      due <Popover usePortal={false} content={<Menu>
      {dueFilters.map((item) => <MenuItem key={item} onClick={() => onChange(item)} text={item} />)}
    </Menu>}>
      <span className={styles.action}>{value}<Icon icon="caret-down" /></span>
    </Popover>
    </div>
  )
}

export default ToolbarDue
