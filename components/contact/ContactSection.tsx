"use client"

import { ContactForm, type ContactFormValues } from "./ContactForm"
import { ContactInfo } from "./ContactInfo"
import { useBooking } from "@/components/booking/BookingContext"

export function ContactSection() {
  const { pendingMessage } = useBooking()

  async function handleSubmit(values: ContactFormValues) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      throw new Error("Failed to submit contact form")
    }
  }

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center py-24 px-6 relative overflow-hidden scroll-mt-24">
      <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-200 h-100 bg-[radial-gradient(circle,rgba(47,169,255,0.12)_0%,rgba(47,169,255,0)_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-11">
          <div className="text-electric-light text-sm tracking-widest mb-2">GET IN TOUCH</div>
          <h2 className="chrome-text font-heading font-extrabold text-4xl">Let&apos;s Make It Shine</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <ContactForm onSubmit={handleSubmit} prefillMessage={pendingMessage} />
          <ContactInfo />
        </div>
      </div>
    </section>
  )
}
