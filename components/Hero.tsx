import { Nav } from "@/components/Nav"
import { MetallicDivider } from "@/components/MetallicDivider"
import { NeonButton } from "@/components/ui/NeonButton"

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex flex-col">
      <Nav />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(circle,rgba(47,169,255,0.18)_0%,rgba(47,169,255,0)_70%)] pointer-events-none" />

      <div className="relative flex-1 flex flex-col justify-center text-center px-6 py-16 max-w-3xl mx-auto">
        <div className="inline-block border border-default text-electric-pale text-sm tracking-widest px-5 py-2 rounded-full mb-8">
          MOBILE DETAILING &amp; CERAMIC COATING
        </div>

        <h1 className="font-heading font-extrabold text-5xl md:text-6xl leading-tight">
          <span className="block chrome-text">MIRROR FINISH.</span>
          <span className="block text-electric drop-shadow-[0_0_20px_rgba(47,169,255,0.55)]">
            EVERY TIME.
          </span>
        </h1>

        <p className="text-body text-lg leading-relaxed mt-8 mb-10 max-w-xl mx-auto">
          Premium mobile auto detailing that comes to you. Hand wash, paint correction, and ceramic
          coatings that leave every panel looking liquid.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <NeonButton href="#contact" className="rounded-lg px-8 py-4 text-base">
            Book Now
          </NeonButton>
          <NeonButton href="#services" className="rounded-lg px-8 py-4 text-base">
            View Services
          </NeonButton>
        </div>

        <div className="flex flex-wrap justify-center gap-9 mt-14 text-faint text-sm tracking-wide">
          <span>&#9733; 5.0 RATED</span>
          <span>MOBILE &mdash; WE COME TO YOU</span>
          <span>CERAMIC COATING CERTIFIED</span>
        </div>
      </div>

      <MetallicDivider />
    </section>
  )
}
