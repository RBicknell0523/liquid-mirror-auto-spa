import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ServiceCard } from "./ServiceCard"

const baseProps = {
  name: "Liquid Mirror Maintenance Wash",
  teaser: "A meticulous exterior maintenance detail.",
  priceLabel: "From $60",
  popular: false,
  onViewDetails: () => {},
}

describe("ServiceCard", () => {
  it("renders the name, teaser, and price label", () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.getByText(baseProps.name)).toBeInTheDocument()
    expect(screen.getByText(baseProps.teaser)).toBeInTheDocument()
    expect(screen.getByText("From $60")).toBeInTheDocument()
  })

  it("does not show the popular badge by default", () => {
    render(<ServiceCard {...baseProps} />)
    expect(screen.queryByText(/most popular/i)).not.toBeInTheDocument()
  })

  it("shows the popular badge when popular is true", () => {
    render(<ServiceCard {...baseProps} popular />)
    expect(screen.getByText(/most popular/i)).toBeInTheDocument()
  })

  it("calls onViewDetails when the button is clicked", async () => {
    const onViewDetails = vi.fn()
    render(<ServiceCard {...baseProps} onViewDetails={onViewDetails} />)
    await userEvent.click(screen.getByRole("button", { name: /view details/i }))
    expect(onViewDetails).toHaveBeenCalledTimes(1)
  })
})
