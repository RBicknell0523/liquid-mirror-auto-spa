import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { ServicesSection } from "@/components/services/ServicesSection"
import { ContactSection } from "@/components/contact/ContactSection"
import { Footer } from "@/components/Footer"
import { BookingProvider } from "@/components/booking/BookingContext"
import { BookingCart } from "@/components/booking/BookingCart"

export default function Home() {
  return (
    <BookingProvider>
      <div className="min-h-screen">
        <Hero />
        <About />
        <ServicesSection />
        <ContactSection />
        <Footer />
      </div>
      <BookingCart />
    </BookingProvider>
  )
}
