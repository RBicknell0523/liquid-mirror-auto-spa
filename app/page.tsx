import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { ServicesSection } from "@/components/services/ServicesSection"
import { ContactSection } from "@/components/contact/ContactSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
