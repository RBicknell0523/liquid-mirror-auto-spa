import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { About } from "./About"

describe("About", () => {
  it("renders the veteran-owned badge", () => {
    render(<About />)
    expect(screen.getByText(/100% veteran owned/i)).toBeInTheDocument()
  })

  it("renders the headline", () => {
    render(<About />)
    expect(screen.getByText(/more than a wash/i)).toBeInTheDocument()
    expect(screen.getByText(/it's a standard/i)).toBeInTheDocument()
  })

  it("renders the three body paragraphs", () => {
    render(<About />)
    expect(screen.getByText(/patience, precision, and genuine pride/i)).toBeInTheDocument()
    expect(screen.getByText(/only liquid mirror can offer/i)).toBeInTheDocument()
  })

  it("renders the italicized standard line in its own element", () => {
    render(<About />)
    const emphasis = screen.getByText(/excellence isn't optional/i)
    expect(emphasis.tagName).toBe("EM")
  })
})
