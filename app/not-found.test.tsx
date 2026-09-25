import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import NotFound from "./not-found"

describe("NotFound", () => {
  it("renders the 404 heading and message", () => {
    render(<NotFound />)
    expect(screen.getByText("ERROR 404")).toBeInTheDocument()
    expect(screen.getByText("PAGE NOT FOUND")).toBeInTheDocument()
  })

  it("renders the brand logo linking back home", () => {
    render(<NotFound />)
    expect(screen.getByAltText(/liquid mirror auto spa/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /liquid mirror auto spa home/i })).toHaveAttribute(
      "href",
      "/",
    )
  })

  it("renders links back to the homepage and contact section", () => {
    render(<NotFound />)
    expect(screen.getByRole("link", { name: "Back to Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "/#contact")
  })
})
