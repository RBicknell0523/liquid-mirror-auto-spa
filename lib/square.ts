import { SquareClient, SquareEnvironment } from "square"

// Deposit charged at booking time to hold the slot; the remaining balance
// (which varies with vehicle condition — see excessiveConditionNotice) is
// collected in person after service.
export const BOOKING_DEPOSIT_AMOUNT_CENTS = BigInt(1500)

let client: SquareClient | null = null

export function getSquareClient(): SquareClient {
  if (client) return client

  const token = process.env.SQUARE_ACCESS_TOKEN
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN is not set")

  client = new SquareClient({
    token,
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  })
  return client
}
