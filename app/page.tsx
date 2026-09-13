import { Hero } from "@/components/Hero"
import { About } from "@/components/About"

export default function Home() {
  return (
    <div className="bg-void min-h-screen">
      <Hero />
      <About />
      <section id="services" />
      <section id="contact" />
    </div>
  )
}
