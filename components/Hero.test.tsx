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
    // "Book Now" appears twice: once in Nav, once in the Hero body.
    const bookNowLinks = screen.getAllByRole("link", { name: "Book Now" })
    expect(bookNowLinks.length).toBeGreaterThanOrEqual(1)
    bookNowLinks.forEach((link) => expect(link).toHaveAttribute("href", "#contact"))

    expect(screen.getByRole("link", { name: "View Services" })).toHaveAttribute(
      "href",
      "#services",
    )
  })

  it("renders the nav bar", () => {
    render(<Hero />)
    expect(screen.getByAltText(/liquid mirror auto spa/i)).toBeInTheDocument()
  })

  it("renders the metallic divider svg", () => {
    const { container } = render(<Hero />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
