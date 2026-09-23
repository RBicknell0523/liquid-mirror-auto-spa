"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Tabs } from "@/components/ui/tabs"
import { NeonButton } from "@/components/ui/NeonButton"

const NAV_TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
]

// Distance (px) scrolled before the logo and Book Now CTA are fully faded out.
const FADE_DISTANCE = 160

export function Nav() {
  const [activeTab, setActiveTab] = useState("home")
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        ticking = false
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleTabChange(tabId: string) {
    setActiveTab(tabId)
    document.getElementById(tabId)?.scrollIntoView({ behavior: "smooth" })
  }

  const fadeOpacity = Math.max(0, 1 - scrollY / FADE_DISTANCE)
  const isFaded = fadeOpacity <= 0.02

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-nav-scrim backdrop-blur-md">
      <a
        href="#home"
        aria-label="Liquid Mirror Auto Spa home"
        style={{ opacity: fadeOpacity }}
        className={`transition-opacity duration-150 ${isFaded ? "pointer-events-none" : ""}`}
      >
        <Image
          src="/liquid-mirror-logo.png"
          alt="Liquid Mirror Auto Spa"
          width={160}
          height={90}
          className="h-16 w-auto"
          priority
        />
      </a>

      <div className="hidden md:block">
        <Tabs tabs={NAV_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <NeonButton
        href="#contact"
        className="rounded-md px-6 py-3 text-base transition-opacity duration-150"
        style={{ opacity: fadeOpacity, pointerEvents: isFaded ? "none" : undefined }}
      >
        Book Now
      </NeonButton>
    </nav>
  )
}
