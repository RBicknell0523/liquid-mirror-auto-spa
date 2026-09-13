import { Nav } from "@/components/Nav"
import { MetallicDivider } from "@/components/MetallicDivider"

export function Hero() {
  return (
    <section id="home" className="bg-void relative overflow-hidden">
      <Nav />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(circle,rgba(47,169,255,0.18)_0%,rgba(47,169,255,0)_70%)] pointer-events-none" />

      <div className="relative text-center px-6 pt-24 pb-16 max-w-3xl mx-auto">
        <div className="inline-block border border-default text-electric-pale text-xs tracking-widest px-4 py-1.5 rounded-full mb-6">
          MOBILE DETAILING &amp; CERAMIC COATING
        </div>

        <h1 className="font-heading font-extrabold text-4xl md:text-5xl leading-tight">
          <span className="block chrome-text">MIRROR FINISH.</span>
          <span className="block text-electric drop-shadow-[0_0_20px_rgba(47,169,255,0.55)]">
            EVERY TIME.
          </span>
        </h1>

        <p className="text-body text-base leading-relaxed mt-6 mb-8 max-w-xl mx-auto">
          Premium mobile auto detailing that comes to you. Hand wash, paint correction, and ceramic
          coatings that leave every panel looking liquid.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="bg-electric-gradient text-white font-semibold text-sm px-7 py-3.5 rounded-lg glow-electric"
          >
            Book Now
          </a>
          <a
            href="#services"
            className="border border-default text-heading font-semibold text-sm px-7 py-3.5 rounded-lg"
          >
            View Services
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-9 mt-14 text-faint text-xs tracking-wide">
          <span>&#9733; 5.0 RATED</span>
          <span>MOBILE &mdash; WE COME TO YOU</span>
          <span>CERAMIC COATING CERTIFIED</span>
        </div>
      </div>

      <MetallicDivider />
    </section>
  )
}
