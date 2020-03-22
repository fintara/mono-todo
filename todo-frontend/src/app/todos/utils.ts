import { isToday, differenceInCalendarDays, isSameWeek, addDays, isSameDay } from "date-fns"
import { DueFilter, Todo, VisibilityFilter } from "./types"

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
      const exhaustive: never = due
  }

  throw Error("unreachable")
}

export function showVisibilityFilter(todo: Todo, visibility: VisibilityFilter): boolean {
  switch (visibility) {
    case "all":
      return true

    case "done":
      return todo.done

    case "tbd":
      return !todo.done

    default:
      const exhaustive: never = visibility
  }

  throw Error("unreachable")
}