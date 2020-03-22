import { Derive, statemachine, Statemachine } from "overmind"
import { User } from "./types"

type State = {
  mode: Statemachine<"anonymous" | "authenticating" | "registering" | "registered" | "authenticated" | "error">
  token: string | null
  error: string | null
  user: User | null
  isAuthenticated: Derive<State, boolean>
}

export const state: State = {
  mode: statemachine({
    initial: "anonymous",
    states: {
      anonymous: ["authenticating", "registering"],

      authenticating: ["error", "authenticated"],
      authenticated: ["anonymous"],

      registering: ["error", "registered"],
      registered: ["authenticating"],

      error: ["authenticating", "registering"]
    }
  }),
  token: null,
  error: null,
  user: null,
  isAuthenticated: (self) => self.token !== null
}