import { SquareClient, SquareEnvironment } from "square"
import { BOOKING_DEPOSIT_USD } from "./bookingDeposit"

export const BOOKING_DEPOSIT_AMOUNT_CENTS = BigInt(BOOKING_DEPOSIT_USD * 100)

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
