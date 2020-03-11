import { OnInitialize } from "overmind"

const onInitialize: OnInitialize = async ({ state, effects }, instance) => {
  effects.todos.api.initialize({
    baseUrl: process.env.REACT_APP_API_URL!,
    getToken: () => {
      if (state.auth.token) return state.auth.token
      throw Error("Unauthorized")
    }
  })
}

export default onInitialize
