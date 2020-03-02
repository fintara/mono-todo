import React from "react"
import ReactDOM from "react-dom"
import { createOvermind } from "overmind"
import { Provider } from "overmind-react"
import { config } from "./app"
import App from "./components/App"

import "normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

const overmind = createOvermind(config, {
  devtools: false,
})

ReactDOM.render(
  <Provider value={overmind}>
    <App/>
  </Provider> ,
  document.getElementById("root")
)
