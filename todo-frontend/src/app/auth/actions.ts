import { Action, AsyncAction } from "overmind"
import { urls } from "../router/types"
import { Credentials, Registration } from "./types"

export const login: AsyncAction<Credentials> = async ({ state, actions, effects }, credentials) => {
  console.log(credentials)
  return state.auth.mode.authenticating(async () => {
    state.auth.error = null

    try {
      const { token } = await effects.auth.api.login(credentials)
      return state.auth.mode.authenticated(() => {
        state.auth.token = token
        actions.router.redirect(urls.todos)
      })
    } catch (e) {
      console.error(e)
      return state.auth.mode.error(() => {
        state.auth.error = "Could not log in"
      })
    }
  })
}

export const loginFromToken: Action<string> = ({ state, actions }, token) => {
  return state.auth.mode.authenticating(() => {
    return state.auth.mode.authenticated(() => {
      state.auth.token = token
      actions.router.redirect(urls.todos)
    })
  })
}

export const logout: Action = ({ state, actions }) => {
  return state.auth.mode.anonymous(() => {
    state.auth.token = null
    state.auth.user = null
    actions.router.redirect(urls.root)
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
      console.error(e)
      return state.auth.mode.error(() => {
        state.auth.error = "Could not register"
      })
    }
  })
}

export const loadUser: AsyncAction = async ({ state, effects }) => {
  try {
    state.auth.user = await effects.auth.api.me()
  } catch (e) {
    state.auth.token = null
  }
}
