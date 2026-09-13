import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Nav } from "./Nav"

describe("Nav", () => {
  it("renders the brand logo", () => {
    render(<Nav />)
    expect(screen.getByAltText(/liquid mirror auto spa/i)).toBeInTheDocument()
  })

  it("renders the primary nav tabs", () => {
    render(<Nav />)
    ;["Home", "About", "Services", "Contact"].forEach((label) => {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument()
    })
  })

  it("renders a Book Now CTA pointing at the contact section", () => {
    render(<Nav />)
    expect(screen.getByRole("link", { name: /book now/i })).toHaveAttribute("href", "#contact")
  })

  it("scrolls to the matching section and marks it active when a tab is clicked", async () => {
    document.body.innerHTML += '<section id="services"></section>'
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView

    render(<Nav />)
    await userEvent.click(screen.getByRole("tab", { name: "Services" }))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" })
    expect(screen.getByRole("tab", { name: "Services" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })
})
