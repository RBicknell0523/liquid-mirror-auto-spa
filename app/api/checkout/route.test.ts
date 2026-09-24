import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { POST } from "./route"

const createPaymentLink = vi.fn()

vi.mock("@/lib/square", () => ({
  BOOKING_DEPOSIT_AMOUNT_CENTS: BigInt(1500),
  getSquareClient: () => ({
    checkout: { paymentLinks: { create: createPaymentLink } },
  }),
}))

const validPayload = {
  description: "Booking summary for Jordan.",
  buyerEmail: "jordan@example.com",
}

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/checkout", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    createPaymentLink.mockReset()
  })

  it("returns 500 when Square is not configured", async () => {
    vi.stubEnv("SQUARE_ACCESS_TOKEN", "")
    vi.stubEnv("SQUARE_LOCATION_ID", "")
    const response = await POST(makeRequest(validPayload))
    expect(response.status).toBe(500)
  })

  describe("with Square configured", () => {
    beforeEach(() => {
      vi.stubEnv("SQUARE_ACCESS_TOKEN", "fake-token")
      vi.stubEnv("SQUARE_LOCATION_ID", "fake-location")
    })

    it("returns 400 for an invalid JSON body", async () => {
      const request = new Request("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it("returns 400 when the description is missing", async () => {
      const response = await POST(makeRequest({ buyerEmail: "jordan@example.com" }))
      expect(response.status).toBe(400)
    })

    it("creates a $15 payment link and returns its url on success", async () => {
      createPaymentLink.mockResolvedValue({
        paymentLink: { url: "https://squareupsandbox.com/checkout/abc123" },
      })

      const response = await POST(makeRequest(validPayload))

      expect(createPaymentLink).toHaveBeenCalledWith(
        expect.objectContaining({
          description: validPayload.description,
          quickPay: expect.objectContaining({
            name: "Booking Deposit",
            priceMoney: { amount: BigInt(1500), currency: "USD" },
            locationId: "fake-location",
          }),
          checkoutOptions: expect.objectContaining({
            redirectUrl: "http://localhost:3000/?booking=confirmed#contact",
          }),
          prePopulatedData: { buyerEmail: "jordan@example.com" },
        }),
      )
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({ url: "https://squareupsandbox.com/checkout/abc123" })
    })

    it("omits prePopulatedData when no buyer email is given", async () => {
      createPaymentLink.mockResolvedValue({ paymentLink: { url: "https://example.com/checkout" } })

      await POST(makeRequest({ description: "Booking summary." }))

      expect(createPaymentLink).toHaveBeenCalledWith(
        expect.objectContaining({ prePopulatedData: undefined }),
      )
    })

    it("returns 502 when Square doesn't return a url", async () => {
      createPaymentLink.mockResolvedValue({ paymentLink: {} })
      const response = await POST(makeRequest(validPayload))
      expect(response.status).toBe(502)
    })

    it("returns 502 when the Square request throws", async () => {
      createPaymentLink.mockRejectedValue(new Error("network error"))
      const response = await POST(makeRequest(validPayload))
      expect(response.status).toBe(502)
    })
  })
})
