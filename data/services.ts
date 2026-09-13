export const CATEGORIES = {
  EXTERIOR: "exterior",
  INTERIOR: "interior",
  ADDON: "addon",
} as const

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES]

export const CATEGORY_LABELS: Record<Category, string> = {
  [CATEGORIES.EXTERIOR]: "Exterior",
  [CATEGORIES.INTERIOR]: "Interior",
  [CATEGORIES.ADDON]: "Add-On Services",
}

export type VehicleSize = "sedan" | "midsize" | "large"

export const VEHICLE_SIZE_LABELS: Record<VehicleSize, string> = {
  sedan: "Sedan / Coupe",
  midsize: "Midsize SUV / Crossover",
  large: "Large SUV / Truck",
}

export interface Service {
  id: string
  category: Category
  name: string
  teaser: string
  description: string
  disclaimer?: string
  pricing: Record<VehicleSize, number>
  popular: boolean
}

export interface AddOnService {
  id: string
  name: string
  description: string
}

export const services: Service[] = [
  {
    id: "maintenance-wash",
    category: CATEGORIES.EXTERIOR,
    name: "Liquid Mirror Maintenance Wash",
    teaser: "A meticulous exterior maintenance detail for regularly maintained vehicles.",
    description:
      "A meticulous exterior maintenance detail designed for regularly maintained vehicles. Includes wheel and tire cleaning, pre-wash treatment, contact wash, detailed rinse, vehicle drying, exterior glass cleaning, and tire dressing.",
    pricing: { sedan: 60, midsize: 70, large: 80 },
    popular: false,
  },
  {
    id: "signature-wash",
    category: CATEGORIES.EXTERIOR,
    name: "Liquid Mirror Signature Wash",
    teaser: "A premium exterior detail that restores gloss with an upgraded paint protectant.",
    description:
      "A premium exterior detail designed to restore gloss and leave your vehicle looking exceptionally clean and protected. Includes a thorough wheel and tire cleaning, wheel wells, pre-wash, hand wash, bug removal as needed, detailed exterior glass, door jambs, tire dressing, and an upgraded paint protectant for enhanced gloss and hydrophobic protection.",
    pricing: { sedan: 90, midsize: 105, large: 120 },
    popular: true,
  },
  {
    id: "revival-detail",
    category: CATEGORIES.EXTERIOR,
    name: "Liquid Mirror Revival Detail",
    teaser: "A comprehensive deep-clean and decontamination to restore your vehicle's finish.",
    description:
      "A comprehensive exterior detail designed to deep-clean, decontaminate, and restore your vehicle's finish. Includes thorough wheel, tire, and wheel-well cleaning, pre-wash and hand wash, bug and tar removal as needed, chemical paint decontamination, clay treatment as needed, detailed exterior glass and door jambs, tire dressing, and premium paint protection for a slick, glossy, hydrophobic finish.",
    pricing: { sedan: 150, midsize: 175, large: 200 },
    popular: false,
  },
  {
    id: "interior-refresh",
    category: CATEGORIES.INTERIOR,
    name: "Liquid Mirror Interior Refresh",
    teaser: "A maintenance-focused interior cleaning for vehicles in good overall condition.",
    description:
      "A maintenance-focused interior cleaning designed for vehicles in good overall condition. Includes thorough vacuuming of seats, carpets, and floor mats; cleaning of dashboard, console, door panels and other interior surfaces; light cleaning of cupholders, vents and accessible crevices; interior glass cleaning; and a clean, natural finish on appropriate plastic and vinyl surfaces. Ideal for routine upkeep between deeper interior details.",
    disclaimer:
      "Pricing applies to vehicles in reasonably maintained condition. Excessive pet hair, staining, sand, debris or other conditions requiring additional labor may incur an additional charge.",
    pricing: { sedan: 75, midsize: 90, large: 110 },
    popular: false,
  },
  {
    id: "signature-interior",
    category: CATEGORIES.INTERIOR,
    name: "Liquid Mirror Signature Interior",
    teaser: "A comprehensive interior detail with steam cleaning and protection.",
    description:
      "A comprehensive interior detail designed to thoroughly clean and refresh the vehicle cabin. Includes detailed vacuuming of seats, carpets and floor mats; deep cleaning of dashboard, console, door panels, cupholders, vents and interior surfaces; steam cleaning and compressed-air detailing of areas and tight crevices; cleaning and protection of plastic and vinyl surfaces; detailed interior glass cleaning, and spot treatment of light stains as needed. Leaves the interior thoroughly cleaned, refreshed and finished with a natural, non-greasy appearance.",
    disclaimer:
      "Pricing applies to vehicles in average condition. Excessive pet hair, staining, sand, debris, odors or other conditions requiring additional labor may incur an additional charge.",
    pricing: { sedan: 125, midsize: 150, large: 175 },
    popular: true,
  },
  {
    id: "interior-revival",
    category: CATEGORIES.INTERIOR,
    name: "Liquid Mirror Interior Revival",
    teaser: "An intensive deep-cleaning service for heavily soiled or neglected interiors.",
    description:
      "An intensive deep-cleaning service designed to revive heavily soiled or neglected interiors. Includes comprehensive vacuuming; detailed cleaning of interior surfaces, vents, cupholders and crevices; steam and compressed-air cleaning where appropriate; deep cleaning and extraction of carpets, floor mats and applicable cloth upholstery; targeted stain treatment; cleaning and protection of plastic and vinyl surfaces; and detailed interior glass cleaning. Finished to restore a clean, refreshed and natural appearance throughout the cabin.",
    disclaimer:
      "Final results depend on the condition, material, and nature of existing stains or contamination. Some permanent staining, discoloration or odors may not be fully removable. Excessive pet hair, severe staining, biohazards, mold, bodily fluids or other specialty conditions are not included in standard pricing and may require additional charges or service refusal.",
    pricing: { sedan: 125, midsize: 150, large: 175 },
    popular: false,
  },
]

export const addOnServices: AddOnService[] = [
  {
    id: "carpet-upholstery-extraction",
    name: "Carpet & Upholstery Extraction",
    description:
      "Deep cleaning and extraction of applicable carpets and cloth upholstery to remove embedded dirt, grime, and staining. Includes targeted pre-treatment, agitation, extraction, and finishing treatments as needed.",
  },
  {
    id: "exterior-glass-treatment",
    name: "Exterior Glass Treatment",
    description:
      "Hydrophobic protection for exterior glass designed to improve water repellency, visibility in wet conditions, and resistance to environmental contamination.",
  },
  {
    id: "wheel-protection",
    name: "Wheel Protection",
    description:
      "Hydrophobic protection applied to thoroughly cleaned wheel surfaces to enhance gloss and help reduce the adhesion of brake dust, road grime, and contamination.",
  },
  {
    id: "exterior-rim-treatment",
    name: "Exterior Rim Treatment",
    description:
      "Cleans, conditions, and protects applicable exterior plastic and rubber trim to restore a darker, refreshed appearance and provide protection from weathering.",
  },
  {
    id: "paint-decontamination",
    name: "Paint Decontamination",
    description:
      "Chemical and mechanical decontamination designed to remove embedded iron particles, bonded contaminants, and surface buildup, leaving the paint noticeably smoother and properly prepared for protection.",
  },
  {
    id: "one-step-paint-enhancement",
    name: "One-Step Paint Enhancement",
    description:
      "Machine polishing service designed to enhance gloss, clarity, and color depth while reducing light swirls and minor paint defects. Results vary based on paint type and condition.",
  },
  {
    id: "multi-step-paint-correction",
    name: "Multi-Step Paint Correction",
    description:
      "Advanced machine correction tailored to significantly reduce swirls, oxidation, scratches, and other paint defects while maximizing gloss and clarity. Vehicle inspection required for pricing.",
  },
]

export const excessiveConditionNotice =
  "Excessive Condition Charge: Additional labor for vehicles requiring substantially more cleaning due to excessive dirt, sand, mud, debris, staining, pet hair, or similar conditions. Final charge is based on vehicle condition."
