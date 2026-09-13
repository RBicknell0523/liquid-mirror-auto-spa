import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BeamsBackground } from "./BeamsBackground"

function mockCanvasContext() {
  const ctx = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    filter: "",
    fillStyle: "",
  }
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext
  return ctx
}

describe("BeamsBackground", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // jsdom doesn't implement canvas 2D contexts; stub it so the draw loop
    // runs instead of silently no-op'ing (and to keep console output clean).
    mockCanvasContext()
    // Run the animation loop exactly once instead of recursing forever.
    rafSpy = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(0)
  })

  afterEach(() => {
    rafSpy.mockRestore()
  })

  it("renders a fixed, hidden-from-assistive-tech canvas backdrop", () => {
    const { container } = render(<BeamsBackground />)
    const root = container.firstElementChild
    expect(root).toHaveAttribute("aria-hidden", "true")
    expect(root).toHaveClass("fixed")
    expect(container.querySelector("canvas")).toBeInTheDocument()
  })

  it("draws beams onto the canvas on mount", () => {
    const ctx = mockCanvasContext()
    render(<BeamsBackground />)
    expect(ctx.fillRect).toHaveBeenCalled()
  })
})
