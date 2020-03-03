import { statemachine, Statemachine } from "overmind"

type State = {
  mode: Statemachine<"anonymous" | "authenticating" | "registering" | "registered" | "authenticated" | "error">
  token: string | null
  error: string | null
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
}