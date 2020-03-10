import { Credentials, Registration } from "../../kt2ts"

export interface Api {
  login(credentials: Credentials): Promise<Authentication>
  register(form: Registration): Promise<void>
}

export type Authentication = {
  token: string
}