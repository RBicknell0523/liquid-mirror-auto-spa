import { Nav } from "@/components/Nav"

export default function Home() {
  return (
    <div className="bg-void min-h-screen">
      <Nav />
      <section id="home" />
      <section id="about" />
      <section id="services" />
      <section id="contact" />
    </div>
  )
}
