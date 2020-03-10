import { OnInitialize } from "overmind"
import { urls } from "../router/types"

const keys = {
  authentication: "token"
}

const onInitialize: OnInitialize = async ({ state, actions, effects }, instance) => {
  const token = localStorage.getItem(keys.authentication)
  if (token) {
    state.auth.token = token
    effects.todos.api.authenticate(token)
    if (state.router.page !== "todos") {
      actions.router.redirect(urls.todos)
    }
  }

  instance.reaction(
    (state) => state.auth.token,
    (value) => {
      effects.todos.api.authenticate(value)
      if (value) {
        localStorage.setItem(keys.authentication, value)
      } else {
        localStorage.removeItem(keys.authentication)
      }
    }
  )
}

export default onInitialize
