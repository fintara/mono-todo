import { mutate, Operator } from "overmind"
import { Page } from "./types"

export const setPage: <T>(page: Page) => Operator<T> = (page) =>
  mutate(({ state: { router } }) => router.page = page)
