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

  it("uses short vehicle-size tab labels so all three fit in the narrow panel", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByRole("tab", { name: "Sedan" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Midsize" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Large" })).toBeInTheDocument()
    // Regression guard: the full labels are too wide for three to fit side by side here.
    expect(screen.queryByRole("tab", { name: "Sedan / Coupe" })).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: "Midsize SUV / Crossover" })).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: "Large SUV / Truck" })).not.toBeInTheDocument()
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

    await userEvent.click(screen.getByRole("tab", { name: "Large" }))
    expect(within(itemRow).getByText("$120")).toBeInTheDocument()
  })

  it("disables Choose Date & Time when the cart is empty and enables it once an item is added", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByRole("button", { name: /choose date & time/i })).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    expect(screen.getByRole("button", { name: /choose date & time/i })).toBeEnabled()
  })

  it("advances to the schedule step and back again", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: /choose date & time/i }))

    expect(screen.getByText("Pick a Date & Time")).toBeInTheDocument()
    expect(screen.queryByText("Liquid Mirror Signature Wash")).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: /back to your booking/i }))
    expect(screen.getByText("Your Booking")).toBeInTheDocument()
    expect(screen.getByText("Liquid Mirror Signature Wash")).toBeInTheDocument()
  })

  it("disables Confirm Booking until a date and time are both chosen, then closes the panel once confirmed", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: /choose date & time/i }))

    const confirmButton = screen.getByRole("button", { name: /confirm booking/i })
    expect(confirmButton).toBeDisabled()

    const dayButtons = within(screen.getByTestId("calendar-days")).getAllByRole("button")
    const enabledDay = dayButtons.find((button) => !button.hasAttribute("disabled"))
    if (!enabledDay) throw new Error("Expected at least one selectable day in the current month")
    await userEvent.click(enabledDay)
    expect(confirmButton).toBeDisabled()

    await userEvent.click(screen.getByRole("button", { name: "10:00 AM" }))
    expect(confirmButton).toBeEnabled()

    await userEvent.click(confirmButton)
    // AnimatePresence removes the panel asynchronously once its exit transition finishes.
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"))
  })

  it("resets back to the cart view the next time it's opened", async () => {
    renderCart()
    await userEvent.click(screen.getByRole("button", { name: "Seed Add Wash" }))
    await userEvent.click(screen.getByRole("button", { name: /choose date & time/i }))
    expect(screen.getByText("Pick a Date & Time")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: /close booking cart/i }))
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"))

    await userEvent.click(screen.getByRole("button", { name: /open booking cart/i }))
    expect(screen.getByText("Your Booking")).toBeInTheDocument()
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
