import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Hero } from "./Hero"

describe("Hero", () => {
  it("renders the headline", () => {
    render(<Hero />)
    expect(screen.getByText("MIRROR FINISH.")).toBeInTheDocument()
    expect(screen.getByText("EVERY TIME.")).toBeInTheDocument()
  })

  it("renders primary and secondary CTAs", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: "Book Now" })).toHaveAttribute("href", "#contact")
    expect(screen.getByRole("link", { name: "View Services" })).toHaveAttribute(
      "href",
      "#services",
    )
  })

  it("renders the metallic divider svg", () => {
    const { container } = render(<Hero />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
