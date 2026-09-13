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

  it("has seven bookable add-on services with no fixed pricing", () => {
    expect(addOnServices).toHaveLength(7)
    addOnServices.forEach((addOn) => {
      expect(addOn).not.toHaveProperty("pricing")
    })
  })

  it("exposes vehicle size display labels", () => {
    expect(VEHICLE_SIZE_LABELS.sedan).toBe("Sedan / Coupe")
    expect(VEHICLE_SIZE_LABELS.large).toBe("Large SUV / Truck")
  })

  it("exposes the excessive condition disclosure text", () => {
    expect(excessiveConditionNotice).toMatch(/excessive condition charge/i)
  })
})
