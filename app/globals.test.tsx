import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import "./globals.css"

describe("design tokens", () => {
  it("applies the void background token", () => {
    render(<div data-testid="void-probe" className="bg-void" />)
    expect(getComputedStyle(screen.getByTestId("void-probe")).backgroundColor).toBe(
      "rgb(5, 5, 5)",
    )
  })

  it("applies the electric-blue text token", () => {
    render(<div data-testid="electric-probe" className="text-electric" />)
    expect(getComputedStyle(screen.getByTestId("electric-probe")).color).toBe(
      "rgb(47, 169, 255)",
    )
  })
})
