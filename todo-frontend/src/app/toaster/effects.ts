import { Intent, Toaster } from "@blueprintjs/core"

class ToasterEffect {
  private toaster: Toaster | null = null

  initialize(toaster: Toaster | null) {
    this.toaster = toaster
  }

  showMessage(message: string, intent: Intent = "none") {
    this.toaster?.show({ intent, message })
  }
}

export const instance = new ToasterEffect()
