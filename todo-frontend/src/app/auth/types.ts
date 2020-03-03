import { Credentials, Registration } from "../../kt2ts"

export interface Api {
  login(credentials: Credentials): Promise<string>
  register(form: Registration): Promise<void>
}
