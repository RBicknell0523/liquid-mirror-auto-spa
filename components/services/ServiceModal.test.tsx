import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ServiceModal } from "./ServiceModal"

const baseProps = {
  categoryLabel: "EXTERIOR PACKAGE",
  name: "Liquid Mirror Maintenance Wash",
  description: "A meticulous exterior maintenance detail.",
  priceRows: [
    { label: "Sedan / Coupe", value: 60 },
    { label: "Midsize SUV / Crossover", value: 70 },
    { label: "Large SUV / Truck", value: 80 },
  ],
  onClose: () => {},
}

describe("ServiceModal", () => {
  it("renders the name, description, and category label", () => {
    render(<ServiceModal {...baseProps} />)
    expect(screen.getByText(baseProps.name)).toBeInTheDocument()
    expect(screen.getByText(baseProps.description)).toBeInTheDocument()
    expect(screen.getByText(baseProps.categoryLabel)).toBeInTheDocument()
  })

  it("renders one row per vehicle size price", () => {
    render(<ServiceModal {...baseProps} />)
    expect(screen.getByText("Sedan / Coupe")).toBeInTheDocument()
    expect(screen.getByText("$60")).toBeInTheDocument()
    expect(screen.getByText("$80")).toBeInTheDocument()
  })

  it('shows "Contact for Pricing" when priceRows is null', () => {
    render(<ServiceModal {...baseProps} priceRows={null} />)
    expect(screen.getByText(/contact for pricing/i)).toBeInTheDocument()
  })

  it("renders the disclaimer when provided", () => {
    render(<ServiceModal {...baseProps} disclaimer="Excessive dirt may incur a charge." />)
    expect(screen.getByText("Excessive dirt may incur a charge.")).toBeInTheDocument()
  })

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn()
    render(<ServiceModal {...baseProps} onClose={onClose} />)
    await userEvent.click(screen.getByRole("button", { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = vi.fn()
    render(<ServiceModal {...baseProps} onClose={onClose} />)
    await userEvent.click(screen.getByRole("dialog"))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
