import { NextResponse } from "next/server"

interface ContactPayload {
  name: string
  phone: string
  email: string
  vehicleType: string
  message: string
}

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") return false
  const payload = value as Record<string, unknown>
  return (
    typeof payload.name === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.email === "string"
  )
}

// Forwards Contact form submissions to a Google Apps Script Web App that
// appends a row to a Google Sheet. Kept server-side so the webhook URL
// never ships to the browser bundle.
export async function POST(request: Request) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set")
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!isContactPayload(payload) || !payload.name || !payload.phone || !payload.email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  const sheetsResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!sheetsResponse.ok) {
    console.error("Google Sheets webhook responded with", sheetsResponse.status)
    return NextResponse.json({ error: "Failed to submit inquiry." }, { status: 502 })
  }

  return NextResponse.json({ status: "ok" })
}
