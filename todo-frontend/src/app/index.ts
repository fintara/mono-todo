import { IConfig } from "overmind"
import { namespaced } from "overmind/config"
import { createHook } from "overmind-react"

import { config as auth } from "./auth"
import { config as todos } from "./todos"
import { config as router } from "./router"
import { config as toaster } from "./toaster"

export const config = namespaced({
  auth,
  todos,
  router,
  toaster,
})

declare module "overmind" {
  interface Config extends IConfig<typeof config> {
  }
}

export const useApp = createHook<typeof config>()
