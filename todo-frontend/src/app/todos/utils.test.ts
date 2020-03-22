import { addHours, addDays } from "date-fns"
import { DueFilter, Todo } from "./types"
import { showDueFilter } from "./utils"

describe("todos::utils", () => {
  describe("showDueFilter", () => {
    const createdAt = new Date("2020-03-21T14:00:00.000Z")

    const list: Todo[] = [
      { id: "100", content: "", createdAt, deadline: null, done: false },
      { id: "150", content: "", createdAt, deadline: addHours(createdAt, 4).toISOString(), done: false }, // today, this week, in 2 days
      { id: "200", content: "", createdAt, deadline: addDays(createdAt, 1).toISOString(),  done: false }, // this week, in 2 days
      { id: "250", content: "", createdAt, deadline: addDays(createdAt, 2).toISOString(),  done: false }, // next week, in 2 days
      { id: "300", content: "", createdAt, deadline: addDays(createdAt, 5).toISOString(),  done: false }, // next week
    ]

    const test = (due: DueFilter, expected: Todo[]) => () => {
      const actual = list.filter(it => showDueFilter(it, due, createdAt))
      expect(actual).toEqual(expected)
    }

    it("should return original list for 'off'", test(
      "off",
      list
    ))

    it("should work for 'today'", test(
      "today",
      [ list[1] ]
    ))

    it("should work for 'in 2 days'", test(
      "in 2 days",
      [ list[1], list[2], list[3] ]
    ))

    it("should work for 'this week'", test(
      "this week",
      [ list[1], list[2] ]
    ))

    it("should work for 'next week'", test(
      "next week",
      [ list[3], list[4] ]
    ))
  })
})