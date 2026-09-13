"use client"

import { useState } from "react"
import {
  services,
  addOnServices,
  excessiveConditionNotice,
  CATEGORIES,
  CATEGORY_LABELS,
  VEHICLE_SIZE_LABELS,
  type Category,
  type VehicleSize,
} from "@/data/services"
import { Tabs } from "@/components/ui/tabs"
import { ServiceCard } from "./ServiceCard"
import { ServiceModal } from "./ServiceModal"

const TABS = [
  { id: CATEGORIES.EXTERIOR, label: CATEGORY_LABELS[CATEGORIES.EXTERIOR] },
  { id: CATEGORIES.INTERIOR, label: CATEGORY_LABELS[CATEGORIES.INTERIOR] },
  { id: CATEGORIES.ADDON, label: CATEGORY_LABELS[CATEGORIES.ADDON] },
]

interface ServiceCardData {
  id: string
  name: string
  teaser: string
  priceLabel: string
  popular: boolean
  categoryLabel: string
  description: string
  disclaimer?: string
  priceRows: { label: string; value: number }[] | null
}

function lowestPrice(pricing: Record<VehicleSize, number>) {
  return Math.min(...Object.values(pricing))
}

function buildPriceRows(pricing: Record<VehicleSize, number>) {
  return (Object.entries(pricing) as [VehicleSize, number][]).map(([key, value]) => ({
    label: VEHICLE_SIZE_LABELS[key],
    value,
  }))
}

function buildCards(activeCategory: Category): ServiceCardData[] {
  if (activeCategory === CATEGORIES.ADDON) {
    return addOnServices.map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      teaser: addOn.description,
      priceLabel: "Contact for Pricing",
      popular: false,
      categoryLabel: "ADD-ON SERVICE",
      description: addOn.description,
      priceRows: null,
    }))
  }

  const categoryLabel = activeCategory === CATEGORIES.EXTERIOR ? "EXTERIOR PACKAGE" : "INTERIOR PACKAGE"

  return services
    .filter((service) => service.category === activeCategory)
    .map((service) => ({
      id: service.id,
      name: service.name,
      teaser: service.teaser,
      priceLabel: `From $${lowestPrice(service.pricing)}`,
      popular: service.popular,
      categoryLabel,
      description: service.description,
      disclaimer: service.disclaimer,
      priceRows: buildPriceRows(service.pricing),
    }))
}

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES.EXTERIOR)
  const [selectedService, setSelectedService] = useState<ServiceCardData | null>(null)

  const cards = buildCards(activeCategory)

  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-electric-light text-xs tracking-widest mb-2">SERVICES &amp; PRICING</div>
          <h2 className="chrome-text text-3xl font-extrabold font-heading">Choose Your Finish</h2>
        </div>

        <div className="flex justify-center mb-10">
          <Tabs
            tabs={TABS}
            activeTab={activeCategory}
            onTabChange={(tabId) => setActiveCategory(tabId as Category)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <ServiceCard
              key={card.id}
              name={card.name}
              teaser={card.teaser}
              priceLabel={card.priceLabel}
              popular={card.popular}
              onViewDetails={() => setSelectedService(card)}
            />
          ))}
        </div>

        {activeCategory === CATEGORIES.ADDON && (
          <p className="text-faint text-xs leading-relaxed mt-8 text-center max-w-2xl mx-auto">
            {excessiveConditionNotice}
          </p>
        )}
      </div>

      {selectedService && (
        <ServiceModal
          categoryLabel={selectedService.categoryLabel}
          name={selectedService.name}
          description={selectedService.description}
          disclaimer={selectedService.disclaimer}
          priceRows={selectedService.priceRows}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  )
}
