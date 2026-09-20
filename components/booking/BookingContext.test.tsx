import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { BookingProvider, useBooking } from "./BookingContext"
import { CATEGORIES } from "@/data/services"

const washPricing = { sedan: 60, midsize: 70, large: 80 }

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
    isOpen,
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
  it("starts empty with sedan as the default vehicle size", () => {
    renderHarness()
    expect(screen.getByTestId("total-items")).toHaveTextContent("0")
    expect(screen.getByTestId("vehicle-size")).toHaveTextContent("sedan")
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

  it("builds a booking summary, closes the cart, and does nothing when empty", async () => {
    renderHarness()

    // No-op when the cart is empty.
    await userEvent.click(screen.getByRole("button", { name: "Request Booking" }))
    expect(screen.getByTestId("pending-message")).toHaveTextContent("")

    await userEvent.click(screen.getByRole("button", { name: "Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: "Request Booking" }))

    expect(screen.getByTestId("is-open")).toHaveTextContent("false")
    const message = screen.getByTestId("pending-message").textContent ?? ""
    expect(message).toContain("Liquid Mirror Signature Wash x1 ($60)")
    expect(message).toContain("Sedan / Coupe")
    expect(message).toContain("Estimated total: $60")
  })
})
