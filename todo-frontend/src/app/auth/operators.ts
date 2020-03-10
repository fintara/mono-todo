import { mutate, Operator, run } from "overmind"
import { urls } from "../router/types"

export const resetMode: <T>() => Operator<T> = () =>
  mutate(({ state }) => state.auth.mode.current === "error" && state.auth.mode.reset())

export const checkAuth: <T>() => Operator<T> = () =>
  run(({ state, actions }) => state.auth.token === null && actions.router.redirect(urls.login))