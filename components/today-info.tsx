"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Calendar, CalendarDays, Percent, Moon } from "lucide-react"

export function TodayInfo() {
  const { t, language } = useLanguage()

  // Get current date information
  const today = new Date()
  const dayOfWeek = today.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { weekday: "long" })
  const day = today.getDate()
  const month = today.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "long" })
  const year = today.getFullYear()

  // Calculate day of year
  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  // Calculate week number
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay()) / 7)

  // Calculate percentage of year completed
  const daysInYear = isLeapYear(today.getFullYear()) ? 366 : 365
  const percentageOfYear = ((dayOfYear / daysInYear) * 100).toFixed(1)

  // Get moon phase (simplified version)
  const moonPhase = getMoonPhase(today)

  // Capitalize first letter of day and month
  const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          {t("whatDayIsToday")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current date */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <p className="text-gray-600 mb-4 text-lg">{t("todayIs")}</p>
            <div className="text-3xl md:text-4xl font-bold text-center text-blue-900">
              <p className="mb-2">{capitalizedDayOfWeek},</p>
              <p>
                {day} {t("of")} {capitalizedMonth} {t("of")} {year}.
              </p>
            </div>
          </div>

          {/* Additional information */}
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Day of year */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 h-[72px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-700">{t("dayOfYear")}:</span>
                </div>
                <span className="font-bold text-lg text-amber-700">{dayOfYear}</span>
              </div>

              {/* Week number */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 h-[72px]">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">{t("weekNumber")}:</span>
                </div>
                <span className="font-bold text-lg text-green-700">{weekNumber}</span>
              </div>

              {/* Year percentage */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 h-[72px]">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{year}:</span>
                </div>
                <span className="font-bold text-lg text-purple-700">{percentageOfYear}%</span>
              </div>

              {/* Moon phase */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 h-[72px]">
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">{t("todaysMoon")}:</span>
                </div>
                <span className="font-bold text-lg text-blue-700">{t(moonPhase)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to check if year is leap year
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// Simplified moon phase calculation
function getMoonPhase(date: Date): string {
  // This is a simplified version - in a real app you'd want a more accurate algorithm
  const phase = Math.floor(((date.getTime() / 86400000 + 2.5) % 29.53) / 3.69)

  const phases = [
    "newMoon",
    "waxingCrescent",
    "firstQuarter",
    "waxingGibbous",
    "fullMoon",
    "waningGibbous",
    "lastQuarter",
    "waningCrescent",
  ]

  return phases[phase]
}
