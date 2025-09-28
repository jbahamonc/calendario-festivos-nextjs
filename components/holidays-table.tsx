"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { type Holiday, getHolidaysByCountryAndYear } from "@/lib/holidays-api"
import { detectUserCountry } from "@/lib/location-utils"
import { Loader2, Download, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HolidaysTable() {
  const { t, language } = useLanguage()
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dateLocale = language === 'es' ? es : enUS

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

  const downloadCSV = () => {
    const headers = [t("date"), t("dayOfWeek"), t("holiday")]
    const rows = holidays.map(holiday => [
      format(new Date(`${holiday.date}T12:00:00`), "d 'de' MMMM", { locale: dateLocale }),
      format(new Date(`${holiday.date}T12:00:00`), "EEEE", { locale: dateLocale }),
      holiday.localName
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `festivos_${new Date().getFullYear()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600 text-sm">{error}</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-4">
          <CalendarDays className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-bold ml-2">{t("holidaysList")}</h2>
        </div>
        <div className="grid grid-cols-[1fr_1fr_2fr] gap-4 font-medium text-sm mb-2 border-b pb-2">
          <div>{t("date")}</div>
          <div>{t("dayOfWeek")}</div>
          <div>{t("holiday")}</div>
        </div>
        <div className="space-y-4">
          {holidays.map((holiday, index) => (
            <div key={`${holiday.date}-${holiday.localName}-${index}`} className="grid grid-cols-[1fr_1fr_2fr] gap-4 text-sm">
              <div>{format(new Date(`${holiday.date}T12:00:00`), "d 'de' MMMM", { locale: dateLocale })}</div>
              <div>{format(new Date(`${holiday.date}T12:00:00`), "EEEE", { locale: dateLocale })}</div>
              <div>{holiday.localName}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
          onClick={downloadCSV}
        >
          <Download className="h-4 w-4" />
          {t("download")} CSV
        </Button>
      </div>
    </div>
  )
}