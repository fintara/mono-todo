import { Authentication, Credentials, Registration, User } from "./types"
import { HttpClient, KyHttpClient } from "../common/http"
import { ApiInitialize } from "../common/types"


export const api = new class {
  private http: HttpClient = undefined as unknown as HttpClient
  private getToken: () => string = undefined as unknown as () => string

  initialize(config: ApiInitialize) {
    this.getToken = config.getToken
    this.http = new KyHttpClient(config.baseUrl)
  }

  login(credentials: Credentials): Promise<Authentication> {
    return this.http.post("/auth/login", credentials)
  }

  register(form: Registration): Promise<void> {
    return this.http.post("/auth/signup", form)
  }

  me(): Promise<User> {
    return this.http.get("/users/me", { token: this.getToken() })
  }

}()

export const storage: Storage = localStorage