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

afterEach(() => {
  cleanup()
})
