import { mutate, Operator, pipe, run, when } from "overmind"

import * as o from "./operators"
import * as authO from "../auth/operators"
import * as todosA from "../todos/actions"
import { urls } from "./types"

export const showHomepage: Operator = when(({ state }) => state.auth.isAuthenticated, {
  true: run(({ actions }) => actions.router.redirect(urls.todos)),
  false: pipe(
    o.setPage("home"),
  )
})

export const showLogin: Operator = pipe(
  o.setPage("login"),
  authO.resetMode(),
)

export const showRegister: Operator = pipe(
  o.setPage("register"),
  authO.resetMode(),
)

export const showTodos: Operator = authO.authenticated(pipe(
  o.setPage("todos"),
  mutate(todosA.load),
))

export const showNotFound: Operator = pipe(
  o.setPage("error_404"),
)

export const redirect: Operator<string> =
  run(({ effects }, url) => effects.router.instance.redirect(url))