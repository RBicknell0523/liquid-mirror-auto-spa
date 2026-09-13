import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { ServicesSection } from "./ServicesSection"

describe("ServicesSection", () => {
  it("shows exterior packages by default", () => {
    render(<ServicesSection />)
    expect(screen.getByText("Liquid Mirror Maintenance Wash")).toBeInTheDocument()
    expect(screen.getByText("Liquid Mirror Signature Wash")).toBeInTheDocument()
    expect(screen.getByText("Liquid Mirror Revival Detail")).toBeInTheDocument()
    expect(screen.queryByText("Liquid Mirror Interior Refresh")).not.toBeInTheDocument()
  })

  it("switches to interior packages when the Interior tab is clicked", async () => {
    render(<ServicesSection />)
    await userEvent.click(screen.getByRole("tab", { name: "Interior" }))
    expect(screen.getByText("Liquid Mirror Interior Refresh")).toBeInTheDocument()
    expect(screen.queryByText("Liquid Mirror Maintenance Wash")).not.toBeInTheDocument()
  })

  it("switches to add-on services and shows the excessive condition notice", async () => {
    render(<ServicesSection />)
    await userEvent.click(screen.getByRole("tab", { name: "Add-On Services" }))
    expect(screen.getByText("Carpet & Upholstery Extraction")).toBeInTheDocument()
    expect(screen.getAllByText(/contact for pricing/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/excessive condition charge/i)).toBeInTheDocument()
  })

  it("opens a modal with the correct pricing when View Details is clicked", async () => {
    render(<ServicesSection />)
    await userEvent.click(screen.getAllByRole("button", { name: /view details/i })[0])
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("$60")).toBeInTheDocument()
  })

  it("closes the modal when the close button is clicked", async () => {
    render(<ServicesSection />)
    await userEvent.click(screen.getAllByRole("button", { name: /view details/i })[0])
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /close/i }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
