import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { NeonButton } from "@/components/ui/NeonButton"

export const metadata: Metadata = {
  title: "Page Not Found | Liquid Mirror Auto Spa",
}

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(circle,rgba(47,169,255,0.18)_0%,rgba(47,169,255,0)_70%)] pointer-events-none" />

      <Link href="/" aria-label="Liquid Mirror Auto Spa home" className="relative mb-10">
        <Image
          src="/liquid-mirror-logo.png"
          alt="Liquid Mirror Auto Spa"
          width={160}
          height={90}
          className="h-16 w-auto"
          priority
        />
      </Link>

      <div className="relative text-electric-light text-sm tracking-widest mb-4">ERROR 404</div>

      <h1 className="relative chrome-text font-heading font-extrabold text-5xl md:text-6xl leading-tight mb-4">
        PAGE NOT FOUND
      </h1>

      <p className="relative text-body text-lg leading-relaxed max-w-md mx-auto mb-10">
        Looks like this page didn&apos;t make it through the wash. Let&apos;s get you back on track.
      </p>

      <div className="relative flex flex-wrap justify-center gap-4">
        <NeonButton href="/" className="rounded-lg px-8 py-4 text-base">
          Back to Home
        </NeonButton>
        <NeonButton href="/#contact" className="rounded-lg px-8 py-4 text-base">
          Contact Us
        </NeonButton>
      </div>
    </div>
  )
}
