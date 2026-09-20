import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { POST } from "./route"

const validPayload = {
  name: "Jordan Smith",
  phone: "5551234567",
  email: "jordan@example.com",
  vehicleType: "Sedan",
  message: "Looking to book a wash.",
}

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("returns 500 when the webhook URL is not configured", async () => {
    vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "")
    const response = await POST(makeRequest(validPayload))
    expect(response.status).toBe(500)
  })

  describe("with a configured webhook URL", () => {
    beforeEach(() => {
      vi.stubEnv("GOOGLE_SHEETS_WEBHOOK_URL", "https://script.google.com/macros/s/fake/exec")
    })

    it("returns 400 for an invalid JSON body", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      })
      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it("returns 400 when required fields are missing", async () => {
      const response = await POST(makeRequest({ name: "", phone: "", email: "" }))
      expect(response.status).toBe(400)
    })

    it("forwards the payload to the webhook and returns 200 on success", async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }))
      vi.stubGlobal("fetch", fetchMock)

      const response = await POST(makeRequest(validPayload))

      expect(fetchMock).toHaveBeenCalledWith(
        "https://script.google.com/macros/s/fake/exec",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(validPayload),
        }),
      )
      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({ status: "ok" })
    })

    it("returns 502 when the webhook request fails", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("error", { status: 500 })))
      const response = await POST(makeRequest(validPayload))
      expect(response.status).toBe(502)
    })
  })
})
