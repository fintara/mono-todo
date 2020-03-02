import { statemachine, Statemachine } from "overmind"

type State = {
  state: Statemachine<"anonymous" | "authenticating" | "registering" | "authenticated" | "error">
  token: string | null
  error: string | null
}

export const state: State = {
  state: statemachine({
    initial: "anonymous",
    states: {
      anonymous: ["authenticating", "registering"],
      authenticated: ["anonymous"],

      authenticating: ["error", "authenticated"],
      registering: ["error", "authenticating"],

      error: ["authenticating", "registering"]
    }
  }),
  token: null,
  error: null,
}