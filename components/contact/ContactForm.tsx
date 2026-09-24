"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { NeonButton } from "@/components/ui/NeonButton"

export interface ContactFormValues {
  name: string
  phone: string
  email: string
  vehicleType: string
  message: string
}

type Status = "idle" | "submitting" | "success" | "error"

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

export function ContactForm({ onSubmit, prefillMessage }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    if (prefillMessage) {
      setValues((prev) => ({ ...prev, message: prefillMessage }))
    }
  }, [prefillMessage])

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
        disabled={status === "submitting"}
        className="w-full rounded-lg py-3.5 mt-2 text-center text-base"
      >
        {status === "submitting" ? "Sending..." : "Send Inquiry"}
      </NeonButton>
    </form>
  )
}
