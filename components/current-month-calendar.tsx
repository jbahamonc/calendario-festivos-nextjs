"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
  isSameDay,
} from "date-fns"
import { es, enUS } from "date-fns/locale"
import { LegendTooltip } from "@/components/legend-tooltip"
import { HolidayTooltip } from "@/components/holiday-tooltip"

interface Holiday {
  date: string
  name: string
  type: string
}

export function CurrentMonthCalendar() {
  const { t, language } = useLanguage()
  const [currentDate] = useState(new Date())
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const dateLocale = language === 'es' ? es : enUS
  const daysOfWeek = language === 'es' ? 
    ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"] : 
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDay = getDay(monthStart)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  useEffect(() => {
    // TODO: Implement API call to get holidays for current month
    const mockHolidays = [
      { date: "2025-09-11", name: "Día Nacional de Catalunya", type: "regional" },
      { date: "2025-09-15", name: "Día de la Independencia", type: "national" },
      { date: "2025-09-24", name: "Nuestra Señora de la Merced", type: "regional" },
    ]
    setHolidays(mockHolidays)
    setLoading(false)
  }, [])

  const isHoliday = (date: Date) => {
    return holidays.some(holiday => isSameDay(new Date(holiday.date), date))
  }

  const getHolidayInfo = (date: Date) => {
    return holidays.find(holiday => isSameDay(new Date(holiday.date), date))
  }

  const handleDayClick = (date: Date) => {
    if (isHoliday(date)) {
      setSelectedDay(selectedDay && isSameDay(selectedDay, date) ? null : date)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-amber-500" />
          {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-amber-600 rounded-full" />
          <span className="text-sm text-muted-foreground">{t("national")}</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium py-1">
            {day}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}

        {daysInMonth.map((date, index) => {
          const isHolidayDay = isHoliday(date)
          const isSelected = selectedDay && isSameDay(selectedDay, date)
          const holiday = getHolidayInfo(date)

          return (
            <div
              key={index}
              className={`relative p-2 text-center cursor-pointer rounded transition-colors
                ${isToday(date) ? "bg-amber-50" : ""}
                ${isHolidayDay ? "hover:bg-amber-100" : ""}`}
              onClick={() => handleDayClick(date)}
            >
              <span className={`text-sm ${isHolidayDay ? "font-semibold text-amber-600" : ""}`}>
                {format(date, "d")}
              </span>
              {isSelected && holiday && (
                <div className="absolute top-full left-0 z-10 mt-1">
                  <div className="bg-white p-4 rounded-lg shadow-lg border text-left min-w-[200px]">
                    <h4 className="font-semibold mb-2">{holiday.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{format(date, "EEEE, d 'de' MMMM", { locale: dateLocale })}</p>
                    <p className="text-xs text-muted-foreground">{t(`${holiday.type}`)}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}