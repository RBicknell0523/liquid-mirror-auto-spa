"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUp, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

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

  // Close the mobile menu on outside click, Escape, or resize past the
  // breakpoint where the inline nav tabs take over.
  useEffect(() => {
    if (!isMenuOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false)
    }

    const desktopQuery = window.matchMedia("(min-width: 768px)")
    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) setIsMenuOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    desktopQuery.addEventListener("change", handleBreakpointChange)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
      desktopQuery.removeEventListener("change", handleBreakpointChange)
    }
  }, [isMenuOpen])

  function handleTabChange(tabId: string) {
    setActiveTab(tabId)
    document.getElementById(tabId)?.scrollIntoView({ behavior: "smooth" })
  }

  function handleMobileTabClick(tabId: string) {
    handleTabChange(tabId)
    setIsMenuOpen(false)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const fadeOpacity = Math.max(0, 1 - scrollY / FADE_DISTANCE)
  const isFaded = fadeOpacity <= 0.02
  const backToTopOpacity = 1 - fadeOpacity
  const isBackToTopHidden = backToTopOpacity <= 0.02

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-nav-scrim backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 md:px-10 py-4">
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

        <div className="flex items-center gap-3">
          <NeonButton
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="rounded-full w-11 h-11 p-0 transition-opacity duration-150"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: backToTopOpacity,
              pointerEvents: isBackToTopHidden ? "none" : undefined,
            }}
          >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
          </NeonButton>

          <div className="hidden md:block">
            <NeonButton
              href="#contact"
              className="rounded-md px-6 py-3 text-base transition-opacity duration-150"
              style={{ opacity: fadeOpacity, pointerEvents: isFaded ? "none" : undefined }}
            >
              Book Now
            </NeonButton>
          </div>

          <div className="md:hidden">
            <NeonButton
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              className="rounded-full w-11 h-11 p-0"
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </NeonButton>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-subtle"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  onClick={() => handleMobileTabClick(tab.id)}
                  className={`text-left text-lg font-medium py-3 border-b border-subtle last:border-b-0 ${
                    activeTab === tab.id ? "text-heading" : "text-nav"
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <NeonButton
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg py-3.5 text-center text-base mt-4"
              >
                Book Now
              </NeonButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
