import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { ContactSection } from "./ContactSection"
import { contactInfo } from "@/data/contactInfo"
import { BookingProvider, useBooking } from "@/components/booking/BookingContext"
import { CATEGORIES } from "@/data/services"

function renderContact() {
  return render(
    <BookingProvider>
      <ContactSection />
    </BookingProvider>,
  )
}

describe("ContactSection", () => {
  it("renders the section heading", () => {
    renderContact()
    expect(screen.getByText(/let's make it shine/i)).toBeInTheDocument()
  })

  it("renders the contact form fields", () => {
    renderContact()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument()
  })

  it("renders the direct contact info", () => {
    renderContact()
    expect(screen.getByText(contactInfo.phone)).toBeInTheDocument()
  })

  it("prefills the message field with the booking cart's requested summary", async () => {
    function SeedAndRequest() {
      const { addItem, setSelectedDate, setSelectedTime, requestBooking } = useBooking()
      return (
        <>
          <button
            type="button"
            onClick={() =>
              addItem({
                id: "signature-wash",
                name: "Liquid Mirror Signature Wash",
                category: CATEGORIES.EXTERIOR,
                categoryLabel: "EXTERIOR PACKAGE",
                pricing: { sedan: 90, midsize: 105, large: 120 },
              })
            }
          >
            Seed
          </button>
          <button type="button" onClick={() => setSelectedDate(new Date(2026, 9, 20))}>
            Pick Date
          </button>
          <button type="button" onClick={() => setSelectedTime("10:00 AM")}>
            Pick Time
          </button>
          <button type="button" onClick={requestBooking}>
            Request
          </button>
        </>
      )
    }

    render(
      <BookingProvider>
        <SeedAndRequest />
        <ContactSection />
      </BookingProvider>,
    )

    await userEvent.click(screen.getByRole("button", { name: "Seed" }))
    await userEvent.click(screen.getByRole("button", { name: "Pick Date" }))
    await userEvent.click(screen.getByRole("button", { name: "Pick Time" }))
    await userEvent.click(screen.getByRole("button", { name: "Request" }))
    const messageField = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    expect(messageField.value).toContain("Liquid Mirror Signature Wash")
  })
})
