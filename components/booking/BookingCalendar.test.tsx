import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { format } from "date-fns"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BookingCalendar } from "./BookingCalendar"

// Tuesday, September 15, 2026 — chosen so the month has both past days
// (1-14) and at least one future Sunday to test against.
const MOCK_TODAY = new Date(2026, 8, 15)

describe("BookingCalendar", () => {
  beforeEach(() => {
    vi.setSystemTime(MOCK_TODAY)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the current month and year", () => {
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={() => {}}
        onSelectTime={() => {}}
      />,
    )
    expect(screen.getByText("September 2026")).toBeInTheDocument()
  })

  it("disables the previous-month button while viewing the current month", () => {
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={() => {}}
        onSelectTime={() => {}}
      />,
    )
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled()
  })

  it("navigates to the next month and re-enables the previous button", async () => {
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={() => {}}
        onSelectTime={() => {}}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Next month" }))
    expect(screen.getByText("October 2026")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Previous month" })).toBeEnabled()
  })

  it("disables past dates and does not call onSelectDate when clicked", async () => {
    const onSelectDate = vi.fn()
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={onSelectDate}
        onSelectTime={() => {}}
      />,
    )
    const pastDay = new Date(2026, 8, 10)
    const pastButton = screen.getByRole("button", { name: format(pastDay, "EEEE, MMMM d") })
    expect(pastButton).toBeDisabled()
    await userEvent.click(pastButton, { pointerEventsCheck: 0 })
    expect(onSelectDate).not.toHaveBeenCalled()
  })

  it("disables Sundays even when they're in the future", async () => {
    const onSelectDate = vi.fn()
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={onSelectDate}
        onSelectTime={() => {}}
      />,
    )
    // September 20, 2026 is a Sunday.
    const sunday = new Date(2026, 8, 20)
    const sundayButton = screen.getByRole("button", { name: format(sunday, "EEEE, MMMM d") })
    expect(sundayButton).toBeDisabled()
    await userEvent.click(sundayButton, { pointerEventsCheck: 0 })
    expect(onSelectDate).not.toHaveBeenCalled()
  })

  it("calls onSelectDate for a selectable future weekday", async () => {
    const onSelectDate = vi.fn()
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={onSelectDate}
        onSelectTime={() => {}}
      />,
    )
    // September 16, 2026 is a Wednesday (future, not Sunday).
    const wednesday = new Date(2026, 8, 16)
    const button = screen.getByRole("button", { name: format(wednesday, "EEEE, MMMM d") })
    expect(button).toBeEnabled()
    await userEvent.click(button)
    expect(onSelectDate).toHaveBeenCalledWith(wednesday)
  })

  it("marks the selected date as pressed", () => {
    const selected = new Date(2026, 8, 16)
    render(
      <BookingCalendar
        selectedDate={selected}
        selectedTime={null}
        onSelectDate={() => {}}
        onSelectTime={() => {}}
      />,
    )
    expect(screen.getByRole("button", { name: format(selected, "EEEE, MMMM d") })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  it("calls onSelectTime when a time slot is clicked", async () => {
    const onSelectTime = vi.fn()
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime={null}
        onSelectDate={() => {}}
        onSelectTime={onSelectTime}
      />,
    )
    await userEvent.click(screen.getByRole("button", { name: "10:00 AM" }))
    expect(onSelectTime).toHaveBeenCalledWith("10:00 AM")
  })

  it("marks the selected time slot as pressed", () => {
    render(
      <BookingCalendar
        selectedDate={null}
        selectedTime="2:00 PM"
        onSelectDate={() => {}}
        onSelectTime={() => {}}
      />,
    )
    expect(screen.getByRole("button", { name: "2:00 PM" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "3:00 PM" })).toHaveAttribute("aria-pressed", "false")
  })
})
