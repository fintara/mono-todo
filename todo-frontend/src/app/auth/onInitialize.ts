import { OnInitialize } from "overmind"
import { isString, restore } from "../common/utils"

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

  restore(
    effects.auth.storage.getItem(keys.authentication),
    isString,
    actions.auth.loginFromToken
  )

  instance.reaction(
    (state) => state.auth.token,
    (value) => {
      if (value) {
        effects.auth.storage.setItem(keys.authentication, value)
      } else {
        effects.auth.storage.removeItem(keys.authentication)
      }
    }
  )
}

export default onInitialize
