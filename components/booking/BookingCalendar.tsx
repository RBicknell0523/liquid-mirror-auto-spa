"use client"

import { useMemo, useState } from "react"
import {
  addMonths,
  format,
  getDate,
  getDaysInMonth,
  isBefore,
  isSameDay,
  isSameMonth,
  isSunday,
  isToday,
  startOfDay,
  startOfMonth,
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

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const totalDays = getDaysInMonth(currentMonth)
    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(start.getFullYear(), start.getMonth(), index + 1)
      return {
        date,
        // Business is closed Sundays (see data/contactInfo.ts hours).
        isDisabled: isBefore(date, today) || isSunday(date),
        isToday: isToday(date),
        isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
      }
    })
  }, [currentMonth, selectedDate, today])

  const isViewingCurrentMonth = isSameMonth(currentMonth, today)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-heading text-2xl font-bold font-heading">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous month"
            disabled={isViewingCurrentMonth}
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
            className="p-2 rounded-full text-nav hover:bg-hover-silver disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="p-2 rounded-full text-nav hover:bg-hover-silver"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div data-testid="calendar-days" className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
        {days.map((day) => (
          <div key={day.date.toISOString()} className="flex flex-col items-center gap-2 shrink-0">
            <span className="text-faint text-sm font-semibold">{format(day.date, "EEEEE")}</span>
            <button
              type="button"
              disabled={day.isDisabled}
              aria-label={format(day.date, "EEEE, MMMM d")}
              aria-pressed={day.isSelected}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                "w-13 h-13 rounded-full text-lg font-semibold flex items-center justify-center relative",
                day.isSelected && "bg-electric-gradient text-white",
                !day.isSelected && !day.isDisabled && "text-heading hover:bg-hover-silver",
                day.isDisabled && "text-faint opacity-40 pointer-events-none",
              )}
            >
              {getDate(day.date)}
              {day.isToday && !day.isSelected && (
                <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-electric" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="text-muted text-sm tracking-widest mb-3">SELECT A TIME</div>
        <div className="grid grid-cols-4 gap-3">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              aria-pressed={selectedTime === time}
              onClick={() => onSelectTime(time)}
              className={cn(
                "text-sm font-semibold py-3 rounded-lg border",
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
