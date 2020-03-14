import React, { useCallback, useState } from "react"
import { Button, ButtonGroup, Intent, Popover, Tag } from "@blueprintjs/core"
import { DatePicker, TimePrecision } from "@blueprintjs/datetime"
import { format, isYesterday, isToday, isTomorrow, isBefore, addHours } from "date-fns"
import { Todo } from "../../app/todos/types"
import styles from "./styles.module.scss"

const formatDeadline = (value: Date | string |  null): [string, Intent] => {
  if (value === null) {
    return ["no deadline", "none"]
  }

  const now = new Date()

  if (typeof value === "string") {
    value = new Date(value)
  }

  if (isBefore(value, now)) {
    if (isYesterday(value)) {
      return ["yesterday " + format(value, "HH:mm"), "danger"]
    }
    if (isToday(value)) {
      return ["today " + format(value, "HH:mm"), "danger"]
    }
    return [format(value, "dd.MM.yyyy HH:mm"), "danger"]
  }

  if (isToday(value)) {
    return ["today " + format(value, "HH:mm"), "warning"]
  }
  if (isTomorrow(value)) {
    return ["tomorrow " + format(value, "HH:mm"), "primary"]
  }
  return [format(value, "dd.MM.yyyy HH:mm"), "primary"]
}

type Props = {
  done: Todo["done"]
  current: Todo["deadline"]
  minDate: Date,
  onChange: (value: Date) => void
  onRemove: () => void
}

const TodoDeadlineDone: React.FC<Pick<Props, "current">> = ({ current }) => {
  if (!current) {
    return <></>
  }
  const [btnText] = formatDeadline(current)
  return <Tag intent="success" large={true} className={styles.tag}>{btnText}</Tag>
}

const TodoDeadlineUndone: React.FC<Omit<Props, "done">> = ({ current, minDate, onChange, onRemove }) => {
  const [isPickerOpen, setPickerOpen] = useState(false)
  const [deadline, setDeadline] = useState(current ? new Date(current) : addHours(new Date(), 4))
  const [btnText, btnIntent] = formatDeadline(current)

  const handleClose = useCallback((value: Date) => {
    value && onChange(value)
    setPickerOpen(false)
  }, [onChange])

  const picker = <div className={styles.picker}>
    <DatePicker
      value={deadline}
      onChange={selectedDate => setDeadline(selectedDate)}
      highlightCurrentDay={true}
      timePrecision={TimePrecision.MINUTE}
      minDate={new Date(minDate)}
      dayPickerProps={{ firstDayOfWeek: 1 }}
      timePickerProps={{ minTime: new Date(minDate) }}
    />
    <Button
      intent="success"
      fill={true}
      text="Save"
      onClick={() => handleClose(deadline)}
    />
  </div>

  const btn = <Button text={btnText} intent={btnIntent} small={true} onClick={() => setPickerOpen(true)}/>

  return (
    <Popover
      isOpen={isPickerOpen}
      onClose={() => setPickerOpen(false)}
      content={picker}
      position="bottom"
      usePortal={true}
    >
      {!current
        ? btn
        : <ButtonGroup>
          {btn}
          <Button intent={btnIntent} icon="small-cross" small={true} onClick={onRemove}/>
        </ButtonGroup>}
    </Popover>
  )
}

const TodoDeadline: React.FC<Props> = ({ done, ...rest }) => (
  done ? <TodoDeadlineDone current={rest.current} /> : <TodoDeadlineUndone {...rest} />
)

export default TodoDeadline
