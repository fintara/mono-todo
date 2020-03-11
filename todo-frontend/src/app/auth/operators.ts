import { mutate, Operator, run, when } from "overmind"
import { urls } from "../router/types"

export const resetMode: <T>() => Operator<T> = () =>
  mutate(({ state }) => state.auth.mode.current === "error" && state.auth.mode.reset())

export const authenticated = <I=void, O=I>(operator: Operator<I, O>) => when(
  (({ state }) => !!state.auth.token),
  {
    true: operator,
    false: run(({ actions }) => actions.router.redirect(urls.login)),
  }
)
