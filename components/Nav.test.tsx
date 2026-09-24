import { act, render, screen, within } from "@testing-library/react"
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
    expect(screen.getByRole("banner")).toHaveClass("sticky", "top-0")
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

  it("shows the Back to Top button only after scrolling, and scrolls to top when clicked", async () => {
    const rafSpy = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo

    render(<Nav />)
    const backToTop = screen.getByRole("button", { name: /back to top/i })

    expect(backToTop.style.opacity).toBe("0")
    expect(backToTop.style.pointerEvents).toBe("none")

    Object.defineProperty(window, "scrollY", { value: 400, configurable: true })
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(backToTop.style.opacity).toBe("1")
    expect(backToTop.style.pointerEvents).not.toBe("none")

    await userEvent.click(backToTop)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })

    rafSpy.mockRestore()
  })

  describe("mobile menu", () => {
    it("is closed by default and opens the link menu when the hamburger is clicked", async () => {
      render(<Nav />)

      const toggle = screen.getByRole("button", { name: /open menu/i, hidden: true })
      expect(toggle).toHaveAttribute("aria-expanded", "false")
      expect(screen.queryByRole("button", { name: /^home$/i, hidden: true })).not.toBeInTheDocument()

      await userEvent.click(toggle)

      expect(screen.getByRole("button", { name: /close menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "true",
      )
      const menu = document.getElementById("mobile-nav-menu") as HTMLElement
      ;["Home", "About", "Services", "Contact"].forEach((label) => {
        expect(within(menu).getByRole("button", { name: label, hidden: true })).toBeInTheDocument()
      })
      expect(within(menu).getByRole("link", { name: /book now/i, hidden: true })).toHaveAttribute(
        "href",
        "#contact",
      )
    })

    it("scrolls to the section and closes the menu when a mobile link is clicked", async () => {
      document.body.innerHTML += '<section id="about"></section>'
      const scrollIntoView = vi.fn()
      HTMLElement.prototype.scrollIntoView = scrollIntoView

      render(<Nav />)
      await userEvent.click(screen.getByRole("button", { name: /open menu/i, hidden: true }))

      const menu = document.getElementById("mobile-nav-menu") as HTMLElement
      await userEvent.click(within(menu).getByRole("button", { name: "About", hidden: true }))

      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" })
      expect(screen.getByRole("button", { name: /open menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("closes when Escape is pressed", async () => {
      render(<Nav />)
      const user = userEvent.setup()

      await user.click(screen.getByRole("button", { name: /open menu/i, hidden: true }))
      expect(screen.getByRole("button", { name: /close menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "true",
      )

      await user.keyboard("{Escape}")
      expect(screen.getByRole("button", { name: /open menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })

    it("closes when clicking outside the header", async () => {
      document.body.innerHTML += '<div data-testid="outside">outside</div>'
      render(<Nav />)

      await userEvent.click(screen.getByRole("button", { name: /open menu/i, hidden: true }))
      expect(screen.getByRole("button", { name: /close menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "true",
      )

      await userEvent.click(screen.getByTestId("outside"))
      expect(screen.getByRole("button", { name: /open menu/i, hidden: true })).toHaveAttribute(
        "aria-expanded",
        "false",
      )
    })
  })
})
