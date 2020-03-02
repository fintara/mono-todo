import { Operator, pipe } from "overmind"

import * as o from "./operators"

export const showHomepage: Operator = pipe(
  o.setPage("home")
)

export const showLogin: Operator = pipe(
  o.setPage("login")
)

export const showRegister: Operator = pipe(
  o.setPage("register")
)

export const showNotFound: Operator = pipe(
  o.setPage("error_404")
)
