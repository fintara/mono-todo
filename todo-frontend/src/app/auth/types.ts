export interface Api {
  login(credentials: Credentials): Promise<string>
  register(form: Registration): Promise<void>
}

export type Credentials = {
  email: string
  password: string
}

export type Registration = {
  email: string
  name: string
  password: string
}
