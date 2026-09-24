"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { NeonButton } from "@/components/ui/NeonButton"
import { BOOKING_DEPOSIT_USD } from "@/lib/bookingDeposit"

export interface ContactFormValues {
  name: string
  phone: string
  email: string
  vehicleType: string
  message: string
}

type Status = "idle" | "submitting" | "redirecting" | "success" | "error"

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => Promise<void>
  /** Set once (e.g. from the booking cart's "Request Booking" action) to fill the message field. */
  prefillMessage?: string
}

const initialValues: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  vehicleType: "",
  message: "",
}

// Returns the Square checkout URL, or null if it couldn't be created — the
// caller falls back to a normal success message rather than blocking the
// already-submitted inquiry on a payment-link failure.
async function createDepositCheckout(description: string, buyerEmail: string): Promise<string | null> {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, buyerEmail }),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { url?: string }
    return data.url ?? null
  } catch {
    return null
  }
}

export function ContactForm({ onSubmit, prefillMessage }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [status, setStatus] = useState<Status>("idle")

  // Fills the message field when prefillMessage changes, adjusted during
  // render (comparing against the previous prop value) instead of an
  // effect, so it doesn't cost an extra render.
  const [prevPrefillMessage, setPrevPrefillMessage] = useState(prefillMessage)
  if (prefillMessage !== prevPrefillMessage) {
    setPrevPrefillMessage(prefillMessage)
    if (prefillMessage) {
      setValues((prev) => ({ ...prev, message: prefillMessage }))
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (status === "error") setStatus("idle")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    try {
      await onSubmit(values)

      // A booking confirmation (message prefilled from the cart) collects a
      // deposit via Square; a general inquiry just needs the info sent above.
      if (prefillMessage) {
        setStatus("redirecting")
        const checkoutUrl = await createDepositCheckout(prefillMessage, values.email)
        if (checkoutUrl) {
          window.location.href = checkoutUrl
          return
        }
      }

      setValues(initialValues)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-subtle rounded-2xl p-6 sm:p-9 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label htmlFor="contact-name" className="flex flex-col gap-1.5 text-muted text-sm">
          NAME
          <input
            id="contact-name"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className="bg-void border border-subtle rounded-lg h-12 px-4 text-heading text-base"
          />
        </label>
        <label htmlFor="contact-phone" className="flex flex-col gap-1.5 text-muted text-sm">
          PHONE
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            required
            className="bg-void border border-subtle rounded-lg h-12 px-4 text-heading text-base"
          />
        </label>
      </div>

      <label htmlFor="contact-email" className="flex flex-col gap-1.5 text-muted text-sm">
        EMAIL
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
          className="bg-void border border-subtle rounded-lg h-12 px-4 text-heading text-base"
        />
      </label>

      <label htmlFor="contact-vehicle" className="flex flex-col gap-1.5 text-muted text-sm">
        VEHICLE TYPE
        <input
          id="contact-vehicle"
          name="vehicleType"
          value={values.vehicleType}
          onChange={handleChange}
          className="bg-void border border-subtle rounded-lg h-12 px-4 text-heading text-base"
        />
      </label>

      <label htmlFor="contact-message" className="flex flex-col gap-1.5 text-muted text-sm">
        MESSAGE
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          className="bg-void border border-subtle rounded-lg px-4 py-3 text-heading text-base"
        />
      </label>

      {status === "success" && (
        <p role="status" className="text-electric-light text-sm">
          Thanks — your inquiry has been sent. We&apos;ll be in touch soon.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-error text-sm">
          Something went wrong sending your inquiry. Please try again, or call/email us directly.
        </p>
      )}

      <NeonButton
        type="submit"
        disabled={status === "submitting" || status === "redirecting"}
        className="w-full rounded-lg py-3.5 mt-2 text-center text-base"
      >
        {status === "submitting" && "Sending..."}
        {status === "redirecting" && "Redirecting to payment..."}
        {status !== "submitting" &&
          status !== "redirecting" &&
          (prefillMessage ? `Pay $${BOOKING_DEPOSIT_USD} Deposit & Book` : "Send Inquiry")}
      </NeonButton>
    </form>
  )
}
