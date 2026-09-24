"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, Minus, Plus, ShoppingCart, X } from "lucide-react"
import { useBooking } from "./BookingContext"
import { BookingCalendar } from "./BookingCalendar"
import { Tabs } from "@/components/ui/tabs"
import { NeonButton } from "@/components/ui/NeonButton"
import { cn } from "@/lib/utils"
import { type VehicleSize } from "@/data/services"
import { BOOKING_DEPOSIT_USD } from "@/lib/bookingDeposit"

// Short labels so all three tabs fit inside the narrow cart panel — the
// full names (used in the modal price table and booking summary) are too
// wide for three to fit side by side at this width.
const VEHICLE_SIZE_SHORT_LABELS: Record<VehicleSize, string> = {
  sedan: "Sedan",
  midsize: "Midsize",
  large: "Large",
}

const VEHICLE_SIZE_TABS = (Object.keys(VEHICLE_SIZE_SHORT_LABELS) as VehicleSize[]).map((id) => ({
  id,
  label: VEHICLE_SIZE_SHORT_LABELS[id],
}))

type Step = "cart" | "schedule"

export function BookingCart() {
  const {
    items,
    vehicleSize,
    setVehicleSize,
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
    toggle,
    close,
    canRequestBooking,
    requestBooking,
  } = useBooking()

  const [step, setStep] = useState<Step>("cart")

  // Always land back on the cart view for a fresh open, rather than
  // wherever the user happened to leave off last time. Adjusted during
  // render (comparing against the previous isOpen) instead of an effect,
  // so opening the cart doesn't cost an extra render.
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setStep("cart")
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={`Open booking cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-electric-gradient text-white flex items-center justify-center glow-electric"
      >
        <ShoppingCart className="w-6 h-6" aria-hidden="true" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-void border border-electric text-electric text-xs font-bold flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="booking-cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={close}
            />
            <motion.div
              key="booking-cart-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Booking cart"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "fixed top-0 right-0 h-full w-full bg-card border-l border-subtle z-50 flex flex-col p-6",
                step === "cart" ? "max-w-sm" : "max-w-md",
              )}
            >
              {step === "cart" ? (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-heading text-lg font-bold font-heading">Your Booking</h2>
                    <button
                      type="button"
                      aria-label="Close booking cart"
                      onClick={close}
                      className="text-faint text-xl"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="mb-5">
                    <div className="text-muted text-xs tracking-widest mb-2">VEHICLE SIZE</div>
                    <Tabs
                      tabs={VEHICLE_SIZE_TABS}
                      activeTab={vehicleSize}
                      onTabChange={(id) => setVehicleSize(id as VehicleSize)}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-3">
                    {items.length === 0 && (
                      <p className="text-muted text-sm leading-relaxed">
                        No services added yet. Browse Services and tap &ldquo;Add to Booking&rdquo;
                        on anything you&apos;d like.
                      </p>
                    )}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        data-testid={`booking-item-${item.id}`}
                        className="border border-subtle rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-heading text-sm font-semibold">{item.name}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeItem(item.id)}
                            className="text-faint shrink-0 -m-1.5 p-1.5"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded border border-default flex items-center justify-center text-nav"
                            >
                              <Minus className="w-3 h-3" aria-hidden="true" />
                            </button>
                            <span className="text-nav text-xs w-4 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded border border-default flex items-center justify-center text-nav"
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" />
                            </button>
                          </div>
                          <span className="text-electric text-sm font-bold">
                            {item.pricing ? `$${item.pricing[vehicleSize] * item.quantity}` : "Quote"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-subtle pt-4 mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-heading text-sm font-semibold">Estimated Total</span>
                      <span className="text-heading text-lg font-bold">
                        ${totalPrice}
                        {hasQuoteItems && (
                          <span className="text-faint text-xs font-normal"> + quotes</span>
                        )}
                      </span>
                    </div>
                    <p className="text-faint text-xs leading-relaxed mb-4">
                      ${BOOKING_DEPOSIT_USD} deposit due now to confirm — remainder due at service.
                    </p>
                    <NeonButton
                      type="button"
                      onClick={() => setStep("schedule")}
                      disabled={items.length === 0}
                      className="w-full rounded-lg py-3.5 text-center text-base"
                    >
                      Choose Date &amp; Time
                    </NeonButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-5">
                    <button
                      type="button"
                      aria-label="Back to your booking"
                      onClick={() => setStep("cart")}
                      className="text-faint hover:text-heading"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <h2 className="text-heading text-lg font-bold font-heading flex-1">
                      Pick a Date &amp; Time
                    </h2>
                    <button
                      type="button"
                      aria-label="Close booking cart"
                      onClick={close}
                      className="text-faint text-xl"
                    >
                      &times;
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto -mx-2 px-2">
                    <BookingCalendar
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectDate={setSelectedDate}
                      onSelectTime={setSelectedTime}
                    />
                  </div>

                  <div className="border-t border-subtle pt-4 mt-4">
                    <NeonButton
                      type="button"
                      onClick={requestBooking}
                      disabled={!canRequestBooking}
                      className="w-full rounded-lg py-3.5 text-center text-base"
                    >
                      Confirm Booking
                    </NeonButton>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
