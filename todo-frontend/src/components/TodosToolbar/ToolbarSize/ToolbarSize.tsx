import React from "react"
import { Icon, Menu, MenuItem, Popover } from "@blueprintjs/core"
import styles from "../styles.module.scss"
import { SizeFilter, sizeFilters } from "../../../app/todos/types"
import { Props } from "../types"

const ToolbarSize: React.FC<Props<SizeFilter>> = ({ value, onChange }) => {
  return (
    <div>
      show <Popover usePortal={false} content={<Menu>
      {sizeFilters.map((item) => <MenuItem key={item} onClick={() => onChange(item)} text={`${item} items`} />)}
    </Menu>}>
      <span className={styles.action}>{value} items<Icon icon="caret-down" /></span>
    </Popover>
    </div>
  )
}

export default ToolbarSize
