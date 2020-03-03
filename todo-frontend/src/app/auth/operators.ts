import { mutate, Operator } from "overmind"

export const resetMode: <T>() => Operator<T> = () =>
  mutate(({ state }) => state.auth.mode.current === "error" && state.auth.mode.reset())
