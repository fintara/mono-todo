import { Action } from "overmind"

export const showSuccess: Action<string> = ({ effects }, message) => {
  effects.toaster.instance.showMessage(message, "success")
}

export const showError: Action<string> = ({ effects }, message) => {
  effects.toaster.instance.showMessage(message, "danger")
}