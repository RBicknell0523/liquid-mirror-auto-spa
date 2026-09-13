import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { ServicesSection } from "@/components/services/ServicesSection"
import { ContactSection } from "@/components/contact/ContactSection"

export default function Home() {
  return (
    <div className="bg-void min-h-screen">
      <Hero />
      <About />
      <ServicesSection />
      <ContactSection />
    </div>
  )
}
