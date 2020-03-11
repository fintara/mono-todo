import { OnInitialize } from "overmind"
import { urls } from "../router/types"

const keys = {
  authentication: "token"
}

const onInitialize: OnInitialize = async ({ state, actions, effects }, instance) => {
  effects.auth.api.initialize({
    baseUrl: process.env.REACT_APP_API_URL!,
    getToken: () => {
      if (state.auth.token) return state.auth.token
      throw Error("Unauthorized")
    }
  })

  const token = localStorage.getItem(keys.authentication)
  if (token) {
    actions.auth.loginFromToken(token)
    if (state.router.page !== "todos") {
      actions.router.redirect(urls.todos)
    }
  }

  instance.reaction(
    (state) => state.auth.token,
    (value) => {
      if (value) {
        localStorage.setItem(keys.authentication, value)
      } else {
        localStorage.removeItem(keys.authentication)
      }
    }
  )
}

export default onInitialize
