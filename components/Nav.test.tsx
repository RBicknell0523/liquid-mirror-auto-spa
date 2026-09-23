import { act, render, screen } from "@testing-library/react"
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

  it("sticks to the top of the viewport", () => {
    render(<Nav />)
    expect(screen.getByRole("navigation")).toHaveClass("sticky", "top-0")
  })

  it("fades the logo and Book Now CTA out as the page scrolls, and back in when scrolled back up", () => {
    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })

    render(<Nav />)
    const logo = screen.getByAltText(/liquid mirror auto spa/i).closest("a") as HTMLElement
    const bookNow = screen.getByRole("link", { name: /book now/i })

    expect(logo.style.opacity).toBe("1")
    expect(bookNow.style.opacity).toBe("1")

    Object.defineProperty(window, "scrollY", { value: 80, configurable: true })
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(Number(logo.style.opacity)).toBeCloseTo(0.5)
    expect(Number(bookNow.style.opacity)).toBeCloseTo(0.5)

    Object.defineProperty(window, "scrollY", { value: 400, configurable: true })
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(logo.style.opacity).toBe("0")
    expect(bookNow.style.opacity).toBe("0")
    expect(logo).toHaveClass("pointer-events-none")
    expect(bookNow.style.pointerEvents).toBe("none")

    Object.defineProperty(window, "scrollY", { value: 0, configurable: true })
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(logo.style.opacity).toBe("1")
    expect(bookNow.style.opacity).toBe("1")

    rafSpy.mockRestore()
  })
})
