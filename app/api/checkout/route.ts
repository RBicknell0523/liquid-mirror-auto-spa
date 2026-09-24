import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { BOOKING_DEPOSIT_AMOUNT_CENTS, getSquareClient } from "@/lib/square"

interface CheckoutPayload {
  description: string
  buyerEmail?: string
}

function isCheckoutPayload(value: unknown): value is CheckoutPayload {
  if (!value || typeof value !== "object") return false
  const payload = value as Record<string, unknown>
  return typeof payload.description === "string" && payload.description.length > 0
}

// Creates a Square Payment Link for the flat booking deposit and hands the
// hosted checkout URL back to the browser to redirect to. Kept server-side
// so the access token never ships to the browser bundle.
export async function POST(request: Request) {
  const locationId = process.env.SQUARE_LOCATION_ID

  if (!locationId || !process.env.SQUARE_ACCESS_TOKEN) {
    console.error("Square is not configured")
    return NextResponse.json({ error: "Checkout is not configured." }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!isCheckoutPayload(payload)) {
    return NextResponse.json({ error: "Missing booking description." }, { status: 400 })
  }

  const origin = new URL(request.url).origin

  try {
    const client = getSquareClient()
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      description: payload.description,
      paymentNote: payload.description,
      quickPay: {
        name: "Booking Deposit",
        priceMoney: { amount: BOOKING_DEPOSIT_AMOUNT_CENTS, currency: "USD" },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${origin}/?booking=confirmed#contact`,
      },
      prePopulatedData: payload.buyerEmail ? { buyerEmail: payload.buyerEmail } : undefined,
    })

    const url = response.paymentLink?.url
    if (!url) {
      console.error("Square did not return a payment link URL", response)
      return NextResponse.json({ error: "Failed to create checkout link." }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (err) {
    console.error("Square checkout creation failed", err)
    return NextResponse.json({ error: "Failed to create checkout link." }, { status: 502 })
  }
}
