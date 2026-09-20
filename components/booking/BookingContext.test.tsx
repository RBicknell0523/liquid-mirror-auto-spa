import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { format } from "date-fns"
import { describe, expect, it } from "vitest"
import { BookingProvider, useBooking } from "./BookingContext"
import { CATEGORIES } from "@/data/services"

const washPricing = { sedan: 60, midsize: 70, large: 80 }
const TEST_DATE = new Date(2026, 9, 20) // October 20, 2026

function Harness() {
  const {
    items,
    vehicleSize,
    setVehicleSize,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    hasQuoteItems,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isOpen,
    canRequestBooking,
    requestBooking,
    pendingMessage,
  } = useBooking()

  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="has-quote-items">{String(hasQuoteItems)}</div>
      <div data-testid="is-open">{String(isOpen)}</div>
      <div data-testid="vehicle-size">{vehicleSize}</div>
      <div data-testid="selected-date">{selectedDate ? selectedDate.toISOString() : ""}</div>
      <div data-testid="selected-time">{selectedTime ?? ""}</div>
      <div data-testid="can-request-booking">{String(canRequestBooking)}</div>
      <div data-testid="pending-message">{pendingMessage}</div>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.name} x{item.quantity}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          addItem({
            id: "signature-wash",
            name: "Liquid Mirror Signature Wash",
            category: CATEGORIES.EXTERIOR,
            categoryLabel: "EXTERIOR PACKAGE",
            pricing: washPricing,
          })
        }
      >
        Add Wash
      </button>
      <button
        type="button"
        onClick={() =>
          addItem({
            id: "paint-decontamination",
            name: "Paint Decontamination",
            category: CATEGORIES.ADDON,
            categoryLabel: "ADD-ON SERVICE",
            pricing: null,
          })
        }
      >
        Add Add-On
      </button>
      <button type="button" onClick={() => removeItem("signature-wash")}>
        Remove Wash
      </button>
      <button type="button" onClick={() => updateQuantity("signature-wash", 1)}>
        Increment Wash
      </button>
      <button type="button" onClick={() => updateQuantity("signature-wash", -1)}>
        Decrement Wash
      </button>
      <button type="button" onClick={() => setVehicleSize("large")}>
        Set Large
      </button>
      <button type="button" onClick={() => setSelectedDate(TEST_DATE)}>
        Pick Date
      </button>
      <button type="button" onClick={() => setSelectedTime("10:00 AM")}>
        Pick Time
      </button>
      <button type="button" onClick={requestBooking}>
        Request Booking
      </button>
    </div>
  )
}

function renderHarness() {
  return render(
    <BookingProvider>
      <Harness />
    </BookingProvider>,
  )
}

describe("BookingContext", () => {
  it("starts empty with sedan as the default vehicle size and no date/time picked", () => {
    renderHarness()
    expect(screen.getByTestId("total-items")).toHaveTextContent("0")
    expect(screen.getByTestId("vehicle-size")).toHaveTextContent("sedan")
    expect(screen.getByTestId("selected-date")).toHaveTextContent("")
    expect(screen.getByTestId("selected-time")).toHaveTextContent("")
  })

  it("adds a new item and opens the cart", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    expect(screen.getByTestId("item-signature-wash")).toHaveTextContent(
      "Liquid Mirror Signature Wash x1",
    )
    expect(screen.getByTestId("total-items")).toHaveTextContent("1")
    expect(screen.getByTestId("total-price")).toHaveTextContent("60")
    expect(screen.getByTestId("is-open")).toHaveTextContent("true")
  })

  it("increments quantity instead of duplicating when the same item is added again", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    expect(screen.getByTestId("item-signature-wash")).toHaveTextContent(
      "Liquid Mirror Signature Wash x2",
    )
    expect(screen.getByTestId("total-items")).toHaveTextContent("2")
    expect(screen.getByTestId("total-price")).toHaveTextContent("120")
  })

  it("recalculates price when the vehicle size changes", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    expect(screen.getByTestId("total-price")).toHaveTextContent("60")
    await userEvent.click(screen.getByRole("button", { name: "Set Large" }))
    expect(screen.getByTestId("total-price")).toHaveTextContent("80")
  })

  it("does not decrement quantity below 1", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Decrement Wash" }))
    expect(screen.getByTestId("item-signature-wash")).toHaveTextContent(
      "Liquid Mirror Signature Wash x1",
    )
  })

  it("removes an item entirely", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Remove Wash" }))
    expect(screen.queryByTestId("item-signature-wash")).not.toBeInTheDocument()
    expect(screen.getByTestId("total-items")).toHaveTextContent("0")
  })

  it("flags quote-only items and excludes them from the price total", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Add-On" }))
    expect(screen.getByTestId("has-quote-items")).toHaveTextContent("true")
    expect(screen.getByTestId("total-price")).toHaveTextContent("0")
  })

  it("stores the selected date and time", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Pick Date" }))
    await userEvent.click(screen.getByRole("button", { name: "Pick Time" }))
    expect(screen.getByTestId("selected-date")).toHaveTextContent(TEST_DATE.toISOString())
    expect(screen.getByTestId("selected-time")).toHaveTextContent("10:00 AM")
  })

  it("cannot request a booking until items, a date, and a time are all set", async () => {
    renderHarness()
    expect(screen.getByTestId("can-request-booking")).toHaveTextContent("false")

    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    expect(screen.getByTestId("can-request-booking")).toHaveTextContent("false")

    await userEvent.click(screen.getByRole("button", { name: "Pick Date" }))
    expect(screen.getByTestId("can-request-booking")).toHaveTextContent("false")

    await userEvent.click(screen.getByRole("button", { name: "Pick Time" }))
    expect(screen.getByTestId("can-request-booking")).toHaveTextContent("true")
  })

  it("does nothing when requestBooking is called without a date/time even if items exist", async () => {
    renderHarness()
    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Request Booking" }))
    expect(screen.getByTestId("pending-message")).toHaveTextContent("")
    expect(screen.getByTestId("is-open")).toHaveTextContent("true")
  })

  it("builds a booking summary including the date/time and closes the cart", async () => {
    renderHarness()

    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Pick Date" }))
    await userEvent.click(screen.getByRole("button", { name: "Pick Time" }))
    await userEvent.click(screen.getByRole("button", { name: "Request Booking" }))

    expect(screen.getByTestId("is-open")).toHaveTextContent("false")
    const message = screen.getByTestId("pending-message").textContent ?? ""
    expect(message).toContain("Liquid Mirror Signature Wash x1 ($60)")
    expect(message).toContain("Sedan / Coupe")
    expect(message).toContain("Estimated total: $60")
    expect(message).toContain(
      `Preferred date/time: ${format(TEST_DATE, "EEEE, MMMM d, yyyy")} at 10:00 AM`,
    )
  })
})
