"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  label: string
}

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [hoverStyle, setHoverStyle] = useState<React.CSSProperties>({})
    const [activeStyle, setActiveStyle] = useState<React.CSSProperties>({
      left: "0px",
      width: "0px",
    })
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab)

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex]
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement
          setHoverStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` })
        }
      }
    }, [hoveredIndex])

    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` })
      }
    }, [activeIndex])

    return (
      <div ref={ref} className={cn("relative overflow-x-auto overflow-y-hidden", className)} {...props}>
        <div className="relative w-max pb-2">
          {/* Hover highlight */}
          <div
            className="absolute h-[38px] transition-all duration-300 ease-out bg-hover-silver rounded-[6px]"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active indicator */}
          <div
            className="absolute bottom-[2px] h-[2px] bg-electric-gradient transition-all duration-300 ease-out"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                role="tab"
                aria-selected={index === activeIndex}
                className={cn(
                  "px-4 py-2 cursor-pointer transition-colors duration-300 h-[38px]",
                  index === activeIndex ? "text-heading" : index === hoveredIndex ? "text-silver" : "text-nav",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onTabChange(tab.id)}
              >
                <div className="text-base font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
)
Tabs.displayName = "Tabs"

export { Tabs }
