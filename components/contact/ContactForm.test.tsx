import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ContactForm } from "./ContactForm"

describe("ContactForm", () => {
  it("renders all fields", () => {
    render(<ContactForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vehicle type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it("updates field values as the user types", async () => {
    render(<ContactForm onSubmit={() => {}} />)
    const nameInput = screen.getByLabelText(/name/i)
    await userEvent.type(nameInput, "Jordan Smith")
    expect(nameInput).toHaveValue("Jordan Smith")
  })

  it("calls onSubmit with the entered values and resets the form", async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/name/i), "Jordan Smith")
    await userEvent.type(screen.getByLabelText(/phone/i), "5551234567")
    await userEvent.type(screen.getByLabelText(/email/i), "jordan@example.com")
    await userEvent.type(screen.getByLabelText(/vehicle type/i), "Sedan")
    await userEvent.type(screen.getByLabelText(/message/i), "Looking to book a wash.")
    await userEvent.click(screen.getByRole("button", { name: /send inquiry/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Jordan Smith",
      phone: "5551234567",
      email: "jordan@example.com",
      vehicleType: "Sedan",
      message: "Looking to book a wash.",
    })
    expect(screen.getByLabelText(/name/i)).toHaveValue("")
  })
})
