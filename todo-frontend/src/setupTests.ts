// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect"
import "mutationobserver-shim"

// @ts-ignore
global.MutationObserver = window.MutationObserver;

// https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
// @ts-ignore
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})
