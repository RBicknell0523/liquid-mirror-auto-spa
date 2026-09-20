import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ContactForm } from "./ContactForm"

describe("ContactForm", () => {
  it("renders all fields", () => {
    render(<ContactForm onSubmit={async () => {}} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vehicle type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it("updates field values as the user types", async () => {
    render(<ContactForm onSubmit={async () => {}} />)
    const nameInput = screen.getByLabelText(/name/i)
    await userEvent.type(nameInput, "Jordan Smith")
    expect(nameInput).toHaveValue("Jordan Smith")
  })

  it("calls onSubmit with the entered values, resets the form, and shows a success message", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
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
    expect(screen.getByRole("status")).toHaveTextContent(/inquiry has been sent/i)
  })

  it("disables the button and shows a sending state while the submission is in flight", async () => {
    let resolveSubmit: () => void = () => {}
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )
    render(<ContactForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/name/i), "Jordan Smith")
    await userEvent.type(screen.getByLabelText(/phone/i), "5551234567")
    await userEvent.type(screen.getByLabelText(/email/i), "jordan@example.com")
    await userEvent.click(screen.getByRole("button", { name: /send inquiry/i }))

    const button = screen.getByRole("button", { name: /sending/i })
    expect(button).toBeDisabled()

    resolveSubmit()
    expect(await screen.findByRole("status")).toHaveTextContent(/inquiry has been sent/i)
  })

  it("shows an error message and keeps the entered values when the submission fails", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("network error"))
    render(<ContactForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/name/i), "Jordan Smith")
    await userEvent.type(screen.getByLabelText(/phone/i), "5551234567")
    await userEvent.type(screen.getByLabelText(/email/i), "jordan@example.com")
    await userEvent.click(screen.getByRole("button", { name: /send inquiry/i }))

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i)
    expect(screen.getByLabelText(/name/i)).toHaveValue("Jordan Smith")
  })

  it("clears the error message once the user starts editing again", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("network error"))
    render(<ContactForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/name/i), "Jordan Smith")
    await userEvent.type(screen.getByLabelText(/phone/i), "5551234567")
    await userEvent.type(screen.getByLabelText(/email/i), "jordan@example.com")
    await userEvent.click(screen.getByRole("button", { name: /send inquiry/i }))
    expect(await screen.findByRole("alert")).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(/name/i), " Jr.")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
