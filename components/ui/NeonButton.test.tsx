import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { NeonButton } from "./NeonButton"

describe("NeonButton", () => {
  afterEach(() => {
    Object.defineProperty(document, "hidden", { value: false, configurable: true })
  })

  it("renders as a link when href is provided", () => {
    render(<NeonButton href="#contact">Book Now</NeonButton>)
    const link = screen.getByRole("link", { name: "Book Now" })
    expect(link).toHaveAttribute("href", "#contact")
    expect(link).toHaveClass("btn-neon")
  })

  it("renders as a button with type=button by default when no href is provided", () => {
    render(<NeonButton>View Details</NeonButton>)
    const button = screen.getByRole("button", { name: "View Details" })
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveClass("btn-neon")
  })

  it("supports type=submit", () => {
    render(<NeonButton type="submit">Send Inquiry</NeonButton>)
    expect(screen.getByRole("button", { name: "Send Inquiry" })).toHaveAttribute("type", "submit")
  })

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn()
    render(<NeonButton onClick={onClick}>View Details</NeonButton>)
    await userEvent.click(screen.getByRole("button", { name: "View Details" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("pauses its glow animation while the tab is hidden", () => {
    render(<NeonButton>Book Now</NeonButton>)
    const button = screen.getByRole("button", { name: "Book Now" })

    Object.defineProperty(document, "hidden", { value: true, configurable: true })
    document.dispatchEvent(new Event("visibilitychange"))
    expect(button).toHaveClass("is-paused")

    Object.defineProperty(document, "hidden", { value: false, configurable: true })
    document.dispatchEvent(new Event("visibilitychange"))
    expect(button).not.toHaveClass("is-paused")
  })
})
