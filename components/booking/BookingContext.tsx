"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { VEHICLE_SIZE_LABELS, type Category, type VehicleSize } from "@/data/services"

export interface BookingItem {
  id: string
  name: string
  category: Category
  categoryLabel: string
  quantity: number
  /** null means the item has no fixed price (e.g. an add-on quoted on inspection). */
  pricing: Record<VehicleSize, number> | null
}

interface BookingContextValue {
  items: BookingItem[]
  vehicleSize: VehicleSize
  setVehicleSize: (size: VehicleSize) => void
  addItem: (item: Omit<BookingItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  totalItems: number
  totalPrice: number
  hasQuoteItems: boolean
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  pendingMessage: string
  requestBooking: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BookingItem[]>([])
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>("sedan")
  const [isOpen, setIsOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState("")

  function addItem(item: Omit<BookingItem, "quantity">) {
    setItems((current) => {
      const existing = current.find((existingItem) => existingItem.id === item.id)
      if (existing) {
        return current.map((existingItem) =>
          existingItem.id === item.id
            ? { ...existingItem, quantity: existingItem.quantity + 1 }
            : existingItem,
        )
      }
      return [...current, { ...item, quantity: 1 }]
    })
    setIsOpen(true)
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  function updateQuantity(id: string, delta: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const nextQuantity = item.quantity + delta
        return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : item
      }),
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    if (!item.pricing) return sum
    return sum + item.pricing[vehicleSize] * item.quantity
  }, 0)
  const hasQuoteItems = items.some((item) => !item.pricing)

  function requestBooking() {
    if (items.length === 0) return

    const lines = items.map((item) => {
      const priceText = item.pricing
        ? `$${item.pricing[vehicleSize] * item.quantity}`
        : "quote requested"
      return `- ${item.name} x${item.quantity} (${priceText})`
    })

    const summary = [
      `I'd like to request a booking for the following (${VEHICLE_SIZE_LABELS[vehicleSize]}):`,
      ...lines,
      totalPrice > 0
        ? `Estimated total: $${totalPrice}${hasQuoteItems ? " + quoted add-ons" : ""}`
        : "",
    ]
      .filter(Boolean)
      .join("\n")

    setPendingMessage(summary)
    setIsOpen(false)
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const value: BookingContextValue = {
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
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
    pendingMessage,
    requestBooking,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
