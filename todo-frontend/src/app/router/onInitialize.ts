import { OnInitialize } from "overmind"
import { urls } from "./types"

const onInitialize: OnInitialize = async ({ actions, effects }, instance) => {
  effects.router.instance.initialize({
    [urls.root]: actions.router.showHomepage,
    [urls.login]: actions.router.showLogin,
    [urls.register]: actions.router.showRegister,
    [urls.todos]: actions.router.showTodos,

    "*": actions.router.showNotFound,
  })
}

export default onInitialize
