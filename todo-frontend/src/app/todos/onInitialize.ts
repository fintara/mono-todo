import { OnInitialize } from "overmind"
import { restore } from "../common/utils"
import { isVisibilityFilter } from "./types"

const keys = {
  visibility: "todos.visibility"
}

const onInitialize: OnInitialize = async ({ state, actions, effects }, instance) => {
  effects.todos.api.initialize({
    baseUrl: process.env.REACT_APP_API_URL!,
    getToken: () => {
      if (state.auth.token) return state.auth.token
      throw Error("Unauthorized")
    }
  })

  restore(
    localStorage.getItem(keys.visibility),
    isVisibilityFilter,
    actions.todos.changeVisibility
  )

  instance.reaction(
    (state) => state.todos.visibility,
    (value) => {
      localStorage.setItem(keys.visibility, value)
    }
  )
}

export default onInitialize
