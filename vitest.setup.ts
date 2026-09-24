import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import fs from "fs"
import path from "path"

const cssPath = path.resolve(__dirname, "app/globals.css")
const cssContent = fs
  .readFileSync(cssPath, "utf-8")
  .replace(/@import url\([^)]+\);?/g, "")
  .replace(/@import "tailwindcss";?/g, "")

const style = document.createElement("style")
style.textContent = cssContent
document.head.appendChild(style)

// jsdom doesn't implement scrollIntoView; several components call it for anchor navigation.
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = function scrollIntoView() {}
}

// jsdom doesn't implement IntersectionObserver; motion's whileInView needs one to exist.
const windowWithIO = window as unknown as { IntersectionObserver?: typeof IntersectionObserver }
if (!windowWithIO.IntersectionObserver) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ""
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  windowWithIO.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
}

// jsdom doesn't implement matchMedia; used to detect the desktop breakpoint
// and (via motion's useReducedMotion) the user's reduced-motion preference.
if (!window.matchMedia) {
  window.matchMedia = function matchMedia(query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  }
}

afterEach(() => {
  cleanup()
})
