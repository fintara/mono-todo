import { AsyncAction } from "overmind"
import { sleep } from "../common/utils"
import { Credentials, Registration } from "../../kt2ts"
import { urls } from "../router/types"

export const login: AsyncAction<Credentials> = async ({ state, effects }, credentials) => {
  console.log(credentials)
  return state.auth.mode.authenticating(async () => {
    state.auth.error = null

    try {
      await sleep(1000)
      state.auth.token = await effects.auth.api.login(credentials)
    } catch (e) {
      return state.auth.mode.error(() => {
        state.auth.error = "Could not log in"
      })
    }
  })
}

export const register: AsyncAction<Registration> = async ({ state, actions, effects }, form) => {
  return state.auth.mode.registering(async () => {
    state.auth.error = null

    try {
      await effects.auth.api.register(form)
      return state.auth.mode.registered(() => {
        effects.router.instance.redirect(urls.login)
      })
    } catch (e) {
      return state.auth.mode.error(() => {
        state.auth.error = "Could not register"
      })
    }
  })
}
