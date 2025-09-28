"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { CalendarPlus, AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { type Holiday, getHolidaysByCountryAndYear } from "@/lib/holidays-api"
import { getNextHolidays } from "@/lib/holiday-utils"
import { detectUserCountry } from "@/lib/location-utils"

export function NextHolidays() {
  const { t, language } = useLanguage()
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNextHolidays = async () => {
      try {
        setLoading(true)
        setError(null)

        const currentYear = new Date().getFullYear()
        const detectedCountry = await detectUserCountry()
        
        // Obtener festivos del año actual y el siguiente
        const [currentYearHolidays, nextYearHolidays] = await Promise.all([
          getHolidaysByCountryAndYear(detectedCountry, currentYear),
          getHolidaysByCountryAndYear(detectedCountry, currentYear + 1)
        ])

        // Combinar los festivos y obtener los próximos
        const allHolidays = [...currentYearHolidays, ...nextYearHolidays]
        const nextHolidays = getNextHolidays(allHolidays, 5)

        setHolidays(nextHolidays)
      } catch (err) {
        console.error("Error loading next holidays:", err)
        setError(t("loadingError"))
      } finally {
        setLoading(false)
      }
    }

    loadNextHolidays()
  }, [t, language])

  const dateLocale = language === 'es' ? es : enUS

  if (error) {
    return (
      <div className="text-center py-4">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <CalendarPlus className="h-5 w-5 text-amber-500" />
        {t("nextHolidays")}
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        </div>
      ) : (
        <ul className="space-y-4">
          {holidays.map((holiday, index) => (
            <li key={`${holiday.date}-${index}`} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {format(new Date(`${holiday.date}T12:00:00`), "EEEE, d 'de' MMMM", { locale: dateLocale })}
              </span>
              <span className="font-medium">{holiday.localName}</span>
            </li>
          ))}
          {holidays.length === 0 && (
            <li className="text-center text-muted-foreground py-4">
              {t("noDataAvailable")}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}