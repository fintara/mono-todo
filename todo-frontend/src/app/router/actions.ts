import { mutate, Operator, pipe } from "overmind"

import * as o from "./operators"

export const showHomepage: Operator = pipe(
  o.setPage("home"),
)

export const showLogin: Operator = pipe(
  o.setPage("login"),
  mutate(({ state }) => state.auth.mode.reset()),
)

export const showRegister: Operator = pipe(
  o.setPage("register"),
  mutate(({ state }) => state.auth.mode.reset()),
)

export const showNotFound: Operator = pipe(
  o.setPage("error_404"),
)
