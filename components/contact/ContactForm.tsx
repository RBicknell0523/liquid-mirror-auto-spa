"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { NeonButton } from "@/components/ui/NeonButton"

export interface ContactFormValues {
  name: string
  phone: string
  email: string
  vehicleType: string
  message: string
}

interface ContactFormProps {
  onSubmit: (values: ContactFormValues) => void
}

const initialValues: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  vehicleType: "",
  message: "",
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
    setValues(initialValues)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-subtle rounded-2xl p-8 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label htmlFor="contact-name" className="flex flex-col gap-1.5 text-muted text-xs">
          NAME
          <input
            id="contact-name"
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className="bg-void border border-subtle rounded-lg h-10 px-3 text-heading text-sm"
          />
        </label>
        <label htmlFor="contact-phone" className="flex flex-col gap-1.5 text-muted text-xs">
          PHONE
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            required
            className="bg-void border border-subtle rounded-lg h-10 px-3 text-heading text-sm"
          />
        </label>
      </div>

      <label htmlFor="contact-email" className="flex flex-col gap-1.5 text-muted text-xs">
        EMAIL
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          required
          className="bg-void border border-subtle rounded-lg h-10 px-3 text-heading text-sm"
        />
      </label>

      <label htmlFor="contact-vehicle" className="flex flex-col gap-1.5 text-muted text-xs">
        VEHICLE TYPE
        <input
          id="contact-vehicle"
          name="vehicleType"
          value={values.vehicleType}
          onChange={handleChange}
          className="bg-void border border-subtle rounded-lg h-10 px-3 text-heading text-sm"
        />
      </label>

      <label htmlFor="contact-message" className="flex flex-col gap-1.5 text-muted text-xs">
        MESSAGE
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={handleChange}
          className="bg-void border border-subtle rounded-lg px-3 py-2 text-heading text-sm"
        />
      </label>

      <NeonButton type="submit" className="w-full rounded-lg py-3 mt-2 text-center">
        Send Inquiry
      </NeonButton>
    </form>
  )
}
