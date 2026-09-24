// Deposit charged at booking time to hold the slot; the remaining balance
// (which varies with vehicle condition — see excessiveConditionNotice) is
// collected in person after service. Shared by client components (to show
// the amount) and the server-only Square client (to charge it), so it only
// needs to change in one place.
export const BOOKING_DEPOSIT_USD = 15
