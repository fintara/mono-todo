import { WithAuthentication } from "../common/http"

export type Registration = {
  email: string;
  password: string;
  name: string;
}

export type Credentials = {
  email: string;
  password: string;
}

export type Authentication = {
  token: string
}

export type User = {
  name: string
}

export interface Api extends WithAuthentication {
  login(credentials: Credentials): Promise<Authentication>
  register(form: Registration): Promise<void>
  me(): Promise<User>
}
