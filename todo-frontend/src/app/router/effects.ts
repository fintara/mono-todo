import page from "page"
import { Params, Router } from "./types"

export class PageRouter implements Router {
  initialize(routes: { [p: string]: (params: Params) => void }) {
    Object.keys(routes).forEach(url => {
      page(url, ({ params }) => routes[url](params))
    })
    page.start()
  }
  open(url: string) {
    page.show(url)
  }
  redirect(url: string) {
    page.redirect(url)
  }
}

export const instance: Router = new PageRouter()
