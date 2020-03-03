export type Params = {
  [param: string]: string
}

export interface Router {
  initialize(routes: { [url: string]: (params: Params) => void }): void
  open(url: string): void
  redirect(url: string): void
}

export type Page
  = "home"
  | "login"
  | "register"
  | "todos"
  | "error_404"

export const urls = {
  "root": "/",
  "login": "/login",
  "register": "/registration",
  "todos": "/todos",
}