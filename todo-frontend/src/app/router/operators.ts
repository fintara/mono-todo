import { filter, mutate, Operator, pipe } from "overmind"
import { Page } from "./types"

export const setPage: <T>(page: Page) => Operator<T> = (page) => pipe(
  filter(({ state }) => state.router.page !== page),
  mutate(({ state: { router } }) => router.page = page)
)
