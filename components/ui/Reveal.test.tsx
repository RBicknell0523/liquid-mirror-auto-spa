import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useReducedMotion } from "motion/react"
import { Reveal } from "./Reveal"

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>()
  return {
    ...actual,
    useReducedMotion: vi.fn(),
  }
})

describe("Reveal", () => {
  it("renders its children", () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    )
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("starts hidden and offset before scrolling into view", () => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    )
    const wrapper = screen.getByText("Hello").parentElement as HTMLElement
    expect(wrapper.style.opacity).toBe("0")
    expect(wrapper.style.transform).toContain("32")
  })

  it("renders statically with no animation when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>,
    )
    const wrapper = screen.getByText("Hello").parentElement as HTMLElement
    expect(wrapper.style.opacity).toBe("")
    expect(wrapper.style.transform).toBe("")
  })
})
