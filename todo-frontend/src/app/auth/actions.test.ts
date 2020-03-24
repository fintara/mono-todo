import { createOvermindMock } from "overmind"
import { config } from "../index"
import { Authentication, Credentials, Registration, User } from "./types"
import { NoopRouter } from "../router/types"
import { InMemoryStorage } from "../common/utils"

describe("auth::actions", () => {
  const user: User = { name: "John" }
  const credentials: Credentials = { email: "john@gmail.com", password: "secret123"}
  const registration: Registration = {...credentials, name: user.name }
  const authentication: Authentication = { token: "test123" }

  const effects = {
    router: { instance: new NoopRouter() },
    auth: {
      storage: new InMemoryStorage(),
      api: {
        login(credentials: Credentials): Promise<Authentication> {
          return Promise.resolve(authentication)
        },
        register(form: Registration): Promise<void> {
          return Promise.resolve()
        },
        me(): Promise<User> {
          return Promise.resolve(user)
        }
      }
    }
  } as const

  describe("login", () => {
    it("should set token", async () => {
      const { state, actions } = createOvermindMock(config, effects)
      actions.auth.logout() // temporary

      expect(state.auth.token).toBeNull()
      await actions.auth.login(credentials)
      expect(state.auth.token).toBe(authentication.token)
    })

    it("should be in proper state on success", async () => {
      const { state, actions } = createOvermindMock(config, effects)
      actions.auth.logout() // temporary

      expect(state.auth.mode.current).toBe("anonymous")
      await actions.auth.login(credentials)
      expect(state.auth.mode.current).toBe("authenticated")
    })

    it("should be in proper state on error", async () => {
      const { state, actions } = createOvermindMock(config, {...effects, ...{
        auth: {
          api: {
            login(credentials: Credentials): Promise<Authentication> {
              return Promise.reject(new Error("not today"))
            }
          }
        }
      }})
      actions.auth.logout() // temporary

      expect(state.auth.mode.current).toBe("anonymous")
      await actions.auth.login(credentials)
      expect(state.auth.mode.current).toBe("error")
    })
  })

  describe("register", () => {
    it("should change empty name to null", async () => {
      const { state, actions } = createOvermindMock(config, {...effects, ...{
        auth: {
          api: {
            register(form: Registration): Promise<void> {
              expect(form.name).toBeNull()
              return Promise.resolve()
            }
          }
        }
      }})
      actions.auth.logout() // temporary

      await actions.auth.register({...registration, name: "  "})
    })

    it("should be in proper state on success", async () => {
      const { state, actions } = createOvermindMock(config, effects)
      actions.auth.logout() // temporary

      expect(state.auth.mode.current).toBe("anonymous")
      await actions.auth.register(registration)
      expect(state.auth.mode.current).toBe("registered")
    })

    it("should be in proper state on error", async () => {
      const { state, actions } = createOvermindMock(config, {...effects, ...{
        auth: {
          api: {
            register(form: Registration): Promise<void> {
              return Promise.reject(new Error("not today"))
            }
          }
        }
      }})
      actions.auth.logout() // temporary

      expect(state.auth.mode.current).toBe("anonymous")
      await actions.auth.register(registration)
      expect(state.auth.mode.current).toBe("error")
    })
  })
})