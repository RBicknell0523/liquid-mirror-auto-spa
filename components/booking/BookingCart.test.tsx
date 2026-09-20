import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { BookingProvider, useBooking } from "./BookingContext"
import { BookingCart } from "./BookingCart"
import { CATEGORIES } from "@/data/services"

// Test-only helper that seeds the cart via the same context BookingCart reads from.
function AddWashButton() {
  const { addItem } = useBooking()
  return (
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
      Seed Add Wash
    </button>
  )
}

function renderCart() {
  return render(
    <BookingProvider>
      <AddWashButton />
      <BookingCart />
    </BookingProvider>,
  )
}

describe("BookingCart", () => {
  it("renders the floating cart button with no badge when empty", () => {
    renderCart()
    expect(screen.getByRole("button", { name: /open booking cart, 0 items/i })).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("opens the panel when the floating button is clicked", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByRole("dialog", { name: /booking cart/i })).toBeInTheDocument()
    expect(screen.getByText(/no services added yet/i)).toBeInTheDocument()
  })

  it("shows an item count badge and the item once something is added", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    // Adding an item auto-opens the panel.
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Liquid Mirror Signature Wash")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /open booking cart, 1 item/i })).toBeInTheDocument()
  })

  it("updates price when quantity is increased and removes the item at zero via the X button", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    const itemRow = screen.getByTestId("booking-item-signature-wash")
    expect(within(itemRow).getByText("$90")).toBeInTheDocument()

    await userEvent.click(
      within(itemRow).getByRole("button", { name: /increase quantity of liquid mirror signature wash/i }),
    )
    expect(within(itemRow).getByText("$180")).toBeInTheDocument()

    await userEvent.click(
      within(itemRow).getByRole("button", { name: /remove liquid mirror signature wash/i }),
    )
    expect(screen.queryByText("Liquid Mirror Signature Wash")).not.toBeInTheDocument()
  })

  it("recalculates the item price when the vehicle size tab changes", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    const itemRow = screen.getByTestId("booking-item-signature-wash")
    expect(within(itemRow).getByText("$90")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("tab", { name: "Large SUV / Truck" }))
    expect(within(itemRow).getByText("$120")).toBeInTheDocument()
  })

  it("disables Request Booking when the cart is empty and enables it once an item is added", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByRole("button", { name: /request booking/i })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    expect(screen.getByRole("button", { name: /request booking/i })).toBeEnabled()
  })

  it("closes the panel when Request Booking is clicked", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: /request booking/i }))
    // AnimatePresence removes the panel asynchronously once its exit transition finishes.
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"))
  })

  it("closes the panel when the backdrop is clicked", async () => {
    const { container } = renderCart()
    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/60")
    expect(backdrop).toBeInTheDocument()
    await userEvent.click(backdrop as Element)
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"))
  })
})
