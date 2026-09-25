import Image from "next/image"
import { contactInfo } from "@/data/contactInfo"
import { NeonButton } from "@/components/ui/NeonButton"

const FOOTER_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-subtle relative">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <a href="#home" aria-label="Liquid Mirror Auto Spa home">
            <Image
              src="/liquid-mirror-logo.png"
              alt="Liquid Mirror Auto Spa"
              width={160}
              height={90}
              className="h-12 w-auto"
            />
          </a>

          <nav className="flex flex-row flex-wrap gap-6 text-sm" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-nav hover:text-heading transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {contactInfo.socials.map((social) => (
              <NeonButton
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="rounded-full w-11 h-11 p-0 text-sm shrink-0"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {social.label}
              </NeonButton>
            ))}
          </div>
        </div>

        <p className="text-faint text-sm text-center md:text-left border-t border-subtle pt-6">
          &copy; {new Date().getFullYear()} Liquid Mirror Auto Spa LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
