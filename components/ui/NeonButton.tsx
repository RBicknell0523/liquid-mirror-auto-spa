"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface NeonButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  "aria-label"?: string
}

// Shared neon-glow-pulse button used for every CTA/submit button on the
// site. Pauses its bloom animation while the tab is hidden to save cycles.
export function NeonButton({
  children,
  href,
  onClick,
  type = "button",
  className,
  ...aria
}: NeonButtonProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    function handleVisibilityChange() {
      ref.current?.classList.toggle("is-paused", document.hidden)
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const sharedClassName = cn("btn-neon text-sm font-semibold", className)

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={sharedClassName} {...aria}>
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={sharedClassName}
      {...aria}
    >
      {children}
    </button>
  )
}
