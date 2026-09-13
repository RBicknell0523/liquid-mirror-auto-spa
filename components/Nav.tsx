"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs } from "@/components/ui/tabs"

const NAV_TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
]

export function Nav() {
  const [activeTab, setActiveTab] = useState("home")

  function handleTabChange(tabId: string) {
    setActiveTab(tabId)
    document.getElementById(tabId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-subtle relative z-10">
      <a href="#home" aria-label="Liquid Mirror Auto Spa home">
        <Image
          src="/liquid-mirror-logo.png"
          alt="Liquid Mirror Auto Spa"
          width={160}
          height={90}
          className="h-10 w-auto"
          priority
        />
      </a>

      <div className="hidden md:block">
        <Tabs tabs={NAV_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <a
        href="#contact"
        className="bg-electric-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-md glow-electric"
      >
        Book Now
      </a>
    </nav>
  )
}
