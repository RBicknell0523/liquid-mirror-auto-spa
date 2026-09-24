"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { ContactForm, type ContactFormValues } from "./ContactForm"
import { ContactInfo } from "./ContactInfo"
import { Reveal } from "@/components/ui/Reveal"
import { useBooking } from "@/components/booking/BookingContext"

export function ContactSection() {
  const { pendingMessage } = useBooking()
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false)

  // Square redirects here with ?booking=confirmed after a successful deposit
  // payment. Read once on mount (window isn't available during SSR) and
  // strip the param so a refresh or reshare of the URL doesn't re-show it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("booking") !== "confirmed") return

    // Unlike the prop/state-sync case this rule targets, there's no
    // render-time alternative: window.location isn't available during SSR,
    // and computing this in the initial render would mismatch the
    // server-rendered (bannerless) markup during hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBookingConfirmation(true)

    params.delete("booking")
    const query = params.toString()
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    )
  }, [])

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

      <Reveal className="max-w-5xl mx-auto relative">
        <div className="text-center mb-11">
          <div className="text-electric-light text-sm tracking-widest mb-2">GET IN TOUCH</div>
          <h2 className="chrome-text font-heading font-extrabold text-4xl">Let&apos;s Make It Shine</h2>
        </div>

        {showBookingConfirmation && (
          <div
            role="status"
            className="flex items-start gap-3 bg-card border border-electric glow-electric rounded-2xl p-5 mb-8 max-w-2xl mx-auto"
          >
            <CheckCircle2 className="w-6 h-6 text-electric shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-heading text-base font-bold mb-1">Deposit received — you&apos;re booked!</div>
              <p className="text-body text-sm leading-relaxed">
                Your $15 deposit went through and your requested date and time are on our radar.
                We&apos;ll be in touch shortly to confirm the details.
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          <ContactForm onSubmit={handleSubmit} prefillMessage={pendingMessage} />
          <ContactInfo />
        </div>
      </Reveal>
    </section>
  )
}
