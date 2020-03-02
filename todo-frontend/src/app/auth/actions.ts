import { AsyncAction } from "overmind"
import { Credentials, Registration } from "./types"

export const login: AsyncAction<Credentials> = async ({ state, effects }, credentials) => {
  return state.auth.state.authenticating(async () => {
    state.auth.error = null

    try {
      state.auth.token = await effects.auth.api.login(credentials)
    } catch (e) {
      return state.auth.state.error(() => {
        state.auth.error = "Could not log in"
      })
    }
  })
}

export const register: AsyncAction<Registration> = async ({ state, actions, effects }, form) => {
  return state.auth.state.registering(async () => {
    state.auth.error = null

    try {
      await effects.auth.api.register(form)
      return actions.auth.login(form)
    } catch (e) {
      return state.auth.state.error(() => {
        state.auth.error = "Could not register"
      })
    }
  })
}
