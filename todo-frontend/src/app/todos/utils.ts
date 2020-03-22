import { isToday, differenceInCalendarDays, isSameWeek, addDays, isSameDay } from "date-fns"
import { DueFilter, Todo } from "./types"

export function showDueFilter(todo: Todo, due: DueFilter, now: Date): boolean {
  if (due === "off") {
    return true
  } else if (!todo.deadline) {
    return false
  }

  switch (due) {
    case "today":
      return isSameDay(now, new Date(todo.deadline))

    case "in 2 days":
      return Math.abs(differenceInCalendarDays(now, new Date(todo.deadline))) <= 2

    case "this week":
      return isSameWeek(now, new Date(todo.deadline), { weekStartsOn: 1 })

    case "next week":
      return isSameWeek(addDays(now, 7), new Date(todo.deadline), { weekStartsOn: 1 })

    default:
      const exchaustive: never = due
  }

  return false
}