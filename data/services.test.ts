import { describe, expect, it } from "vitest"
import {
  CATEGORIES,
  services,
  addOnServices,
  VEHICLE_SIZE_LABELS,
  excessiveConditionNotice,
} from "./services"

describe("services data", () => {
  it("has three exterior packages with the correct prices", () => {
    const exterior = services.filter((s) => s.category === CATEGORIES.EXTERIOR)
    expect(exterior).toHaveLength(3)
    expect(exterior.find((s) => s.id === "maintenance-wash")?.pricing).toEqual({
      sedan: 60,
      midsize: 70,
      large: 80,
    })
    expect(exterior.find((s) => s.id === "revival-detail")?.pricing).toEqual({
      sedan: 150,
      midsize: 175,
      large: 200,
    })
  })

  it("has three interior packages with the correct prices", () => {
    const interior = services.filter((s) => s.category === CATEGORIES.INTERIOR)
    expect(interior).toHaveLength(3)
    expect(interior.find((s) => s.id === "signature-interior")?.pricing).toEqual({
      sedan: 125,
      midsize: 150,
      large: 175,
    })
  })

  it("has ten bookable add-on services", () => {
    expect(addOnServices).toHaveLength(10)
  })

  it("has fixed prices on the priced add-ons", () => {
    expect(addOnServices.find((a) => a.id === "exterior-glass-treatment")?.price).toBe(40)
    expect(addOnServices.find((a) => a.id === "wheel-protection")?.price).toBe(30)
    expect(addOnServices.find((a) => a.id === "trim-restoration-protection")?.price).toBe(30)
    expect(addOnServices.find((a) => a.id === "paint-decontamination")?.price).toBe(75)
    expect(addOnServices.find((a) => a.id === "engine-bay-detail")?.price).toBe(50)
    expect(addOnServices.find((a) => a.id === "premium-hydrophobic-protection")?.price).toBe(25)
    expect(addOnServices.find((a) => a.id === "undercarriage-cleaning")?.price).toBe(30)
  })

  it("leaves quote-only add-ons without a fixed price", () => {
    expect(addOnServices.find((a) => a.id === "carpet-upholstery-extraction")?.price).toBeUndefined()
    expect(addOnServices.find((a) => a.id === "one-step-paint-enhancement")?.price).toBeUndefined()
    expect(addOnServices.find((a) => a.id === "multi-step-paint-correction")?.price).toBeUndefined()
  })

  it("includes the vehicle clearance disclaimer for undercarriage cleaning", () => {
    expect(addOnServices.find((a) => a.id === "undercarriage-cleaning")?.disclaimer).toMatch(
      /vehicle clearance/i,
    )
  })

  it("exposes vehicle size display labels", () => {
    expect(VEHICLE_SIZE_LABELS.sedan).toBe("Sedan / Coupe")
    expect(VEHICLE_SIZE_LABELS.large).toBe("Large SUV / Truck")
  })

  it("exposes the excessive condition disclosure text", () => {
    expect(excessiveConditionNotice).toMatch(/excessive condition charge/i)
  })
})
