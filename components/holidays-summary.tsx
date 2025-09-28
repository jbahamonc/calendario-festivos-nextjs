"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { CalendarDays, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { type Holiday, getHolidaysByCountryAndYear } from "@/lib/holidays-api"
import { detectUserCountry } from "@/lib/location-utils"
import { Badge } from "./ui/badge"

export function HolidaysSummary() {
  const { t, language } = useLanguage()
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        setLoading(true)
        setError(null)

        const currentYear = new Date().getFullYear()
        const detectedCountry = await detectUserCountry()
        const yearHolidays = await getHolidaysByCountryAndYear(detectedCountry, currentYear)
        setHolidays(yearHolidays)
      } catch (err) {
        console.error("Error loading holidays:", err)
        setError(t("loadingError"))
      } finally {
        setLoading(false)
      }
    }

    loadHolidays()
  }, [t])

  const dateLocale = language === 'es' ? es : enUS

  if (error) {
    return (
      <div className="text-center py-4">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  // Encuentra el próximo día festivo
  const today = new Date()
  const nextHoliday = holidays.find(holiday => {
    const holidayDate = new Date(`${holiday.date}T12:00:00`)
    return holidayDate >= today
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {t("holidaysSummary.title")}
        </h2>        
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("holidaysSummary.description")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="text-sm font-medium mb-2">{t("holidaysSummary.types.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("holidaysSummary.types.description")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">{t("holidaysSummary.importance.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("holidaysSummary.importance.description")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}