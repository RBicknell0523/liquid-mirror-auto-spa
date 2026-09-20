"use client"

import { useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isBefore,
  isSameDay,
  isSameMonth,
  isSunday,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"]

interface BookingCalendarProps {
  selectedDate: Date | null
  selectedTime: string | null
  onSelectDate: (date: Date) => void
  onSelectTime: (time: string) => void
}

export function BookingCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: BookingCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [currentMonth, setCurrentMonth] = useState(selectedDate ?? today)

  // A full 7-column grid, padded with the leading/trailing days of
  // adjacent months so every week row is complete — like an actual
  // calendar page rather than a single scrolling row of the month's days.
  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(currentMonth))
    const gridEnd = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => {
      const isOutsideMonth = !isSameMonth(date, currentMonth)
      return {
        date,
        isOutsideMonth,
        // Business is closed Sundays (see data/contactInfo.ts hours).
        isDisabled: isOutsideMonth || isBefore(date, today) || isSunday(date),
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      }
    })
  }, [currentMonth, selectedDate, today])

  const isViewingCurrentMonth = isSameMonth(currentMonth, today)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-heading text-lg font-bold font-heading">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            disabled={isViewingCurrentMonth}
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
            className="p-1.5 rounded-full text-nav hover:bg-hover-silver disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="p-1.5 rounded-full text-nav hover:bg-hover-silver"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_HEADERS.map((label, index) => (
          <div key={index} className="text-faint text-xs font-semibold text-center py-1">
            {label}
          </div>
        ))}
      </div>

      <div data-testid="calendar-days" className="grid grid-cols-7 gap-y-1">
        {days.map((day) => (
          <div key={day.date.toISOString()} className="flex items-center justify-center py-0.5">
            <button
              type="button"
              disabled={day.isDisabled}
              aria-label={format(day.date, "EEEE, MMMM d")}
              aria-pressed={day.isSelected}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                "w-10 h-10 rounded-full text-sm font-semibold flex items-center justify-center relative",
                day.isSelected && "bg-electric-gradient text-white",
                !day.isSelected && !day.isDisabled && "text-heading hover:bg-hover-silver",
                day.isDisabled && !day.isOutsideMonth && "text-faint opacity-40 pointer-events-none",
                day.isOutsideMonth && "text-faint opacity-15 pointer-events-none",
              )}
            >
              {getDate(day.date)}
              {day.isToday && !day.isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-electric" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-muted text-xs tracking-widest mb-2">SELECT A TIME</div>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              aria-pressed={selectedTime === time}
              onClick={() => onSelectTime(time)}
              className={cn(
                "text-xs font-semibold py-2 rounded-lg border",
                selectedTime === time
                  ? "border-electric bg-electric-gradient text-white"
                  : "border-default text-nav hover:border-electric-pale",
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
