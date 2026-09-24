import { isWeekend } from "date-fns"

// Weekdays: evening appointments only. Weekends (Sat + Sun): full days.
// Slots stop an hour before closing to leave time to finish the job.
const WEEKDAY_TIME_SLOTS = ["5:00 PM", "6:00 PM"]
const WEEKEND_TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
]

export function getTimeSlotsForDate(date: Date): string[] {
  return isWeekend(date) ? WEEKEND_TIME_SLOTS : WEEKDAY_TIME_SLOTS
}
