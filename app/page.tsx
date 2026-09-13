import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { ServicesSection } from "@/components/services/ServicesSection"

export default function Home() {
  return (
    <div className="bg-void min-h-screen">
      <Hero />
      <About />
      <ServicesSection />
      <section id="contact" />
    </div>
  )
}
