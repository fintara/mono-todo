import { map, mutate, Operator, pipe, run } from "overmind"

import * as o from "./operators"
import * as authO from "../auth/operators"
import * as todosA from "../todos/actions"

export const showHomepage: Operator = pipe(
  o.setPage("home"),
)

export const showLogin: Operator = pipe(
  o.setPage("login"),
  authO.resetMode(),
)

export const showRegister: Operator = pipe(
  o.setPage("register"),
  authO.resetMode(),
)

export const showTodos: Operator = pipe(
  o.setPage("todos"),
  mutate(todosA.load),
)

export const showNotFound: Operator = pipe(
  o.setPage("error_404"),
)
