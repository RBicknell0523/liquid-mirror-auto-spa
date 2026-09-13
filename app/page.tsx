import { Hero } from "@/components/Hero"

export default function Home() {
  return (
    <div className="bg-void min-h-screen">
      <Hero />
      <section id="about" />
      <section id="services" />
      <section id="contact" />
    </div>
  )
}
