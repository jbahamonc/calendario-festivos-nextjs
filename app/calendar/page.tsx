"use client"

import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  Globe,
  Loader2,
  RefreshCw,
  AlertCircle,
  Calendar,
  MapPin,
  Hash,
  Info,
  AlertTriangle,
  Sparkles,
  Languages,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAvailableCountries, getHolidaysByCountryAndYear, type Country, type Holiday } from "@/lib/holidays-api"
import { MonthCalendar } from "@/components/month-calendar"
import { LanguageSelector } from "@/components/language-selector"
import { Footer } from "@/components/footer"
import { TodayInfo } from "@/components/today-info"
import { HolidayInfo } from "@/components/holiday-info"
import { FAQ } from "@/components/faq"
import { useLanguage } from "@/contexts/language-context"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 76 }, (_, i) => {
  const year = 1975 + i
  return {
    value: year.toString(),
    label: year.toString(),
  }
})

import { detectUserCountry } from "@/lib/location-utils"
import { MainHeader } from "@/components/main-header"

export default function HolidayCalendar() {
  const { t, getMonths } = useLanguage()
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedYear, setSelectedYear] = useState(currentYear.toString()) // Año actual por defecto
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [holidaysLoading, setHolidaysLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [holidaysError, setHolidaysError] = useState<string | null>(null)
  const [dataAvailable, setDataAvailable] = useState(true)
  const [countryDetected, setCountryDetected] = useState(false)
  const [originalDetectedCountry, setOriginalDetectedCountry] = useState("")

  // Cargar países disponibles y detectar país del usuario
  useEffect(() => {
    const loadCountriesAndDetectLocation = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar países disponibles
        const availableCountries = await getAvailableCountries()
        setCountries(availableCountries)

        // Detectar país del usuario
        const detectedCountry = await detectUserCountry()
        setOriginalDetectedCountry(detectedCountry)

        // Verificar si el país detectado está en la lista de países disponibles
        const countryExists = availableCountries.find((c) => c.countryCode === detectedCountry)

        if (countryExists) {
          setSelectedCountry(detectedCountry)
          setCountryDetected(true)
          console.log(`País detectado automáticamente: ${countryExists.name} (${detectedCountry})`)
        } else {
          // Fallback: usar México o el primer país disponible
          const fallbackCountry = availableCountries.find((c) => c.countryCode === "MX") || availableCountries[0]
          if (fallbackCountry) {
            setSelectedCountry(fallbackCountry.countryCode)
            console.log(`Usando país fallback: ${fallbackCountry.name}`)
          }
        }
      } catch (err) {
        setError(t("loadingError"))
        console.error("Error loading countries:", err)
      } finally {
        setLoading(false)
      }
    }

    loadCountriesAndDetectLocation()
  }, [t])

  // Cargar días festivos cuando cambia el país o año
  useEffect(() => {
    const loadHolidays = async () => {
      if (!selectedCountry) return

      try {
        setHolidaysLoading(true)
        setHolidaysError(null)
        setDataAvailable(true)

        const countryHolidays = await getHolidaysByCountryAndYear(selectedCountry, Number.parseInt(selectedYear))
        setHolidays(countryHolidays)

        // Si no hay datos, mostrar mensaje informativo
        if (countryHolidays.length === 0) {
          setDataAvailable(false)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t("holidaysError")
        setHolidaysError(errorMessage)
        setHolidays([])
        setDataAvailable(false)
        console.error("Error loading holidays:", err)
      } finally {
        setHolidaysLoading(false)
      }
    }

    loadHolidays()
  }, [selectedCountry, selectedYear, t])

  // Crear set de fechas festivas para comparación rápida
  const holidayDates = useMemo(() => {
    return new Set(holidays.map((holiday) => holiday.date))
  }, [holidays])

  // Función para recargar datos
  const refreshData = async () => {
    if (!selectedCountry) return

    try {
      setHolidaysLoading(true)
      setHolidaysError(null)
      setDataAvailable(true)

      const countryHolidays = await getHolidaysByCountryAndYear(selectedCountry, Number.parseInt(selectedYear))
      setHolidays(countryHolidays)

      if (countryHolidays.length === 0) {
        setDataAvailable(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("refreshError")
      setHolidaysError(errorMessage)
      setDataAvailable(false)
      console.error("Error refreshing holidays:", err)
    } finally {
      setHolidaysLoading(false)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const selectedCountryName = countries.find((c) => c.countryCode === selectedCountry)?.name || ""

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-lg text-gray-600">{t("loading")}</p>
          <p className="text-sm text-gray-500 mt-2">{t("detectingLocation")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t("connectionError")}</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("retry")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Banner Simplificado */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        <MainHeader className="bg-transparent border-b border-white/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              {t("calendarTitle")}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {t("calendarDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
              

              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t("configuration")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t("country")}
                      {countryDetected && selectedCountry === originalDetectedCountry && (
                        <span className="ml-2 text-xs text-green-600">({t("autoDetected")})</span>
                      )}
                    </label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCountry")} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.countryCode} value={country.countryCode}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t("year")}
                      {selectedYear === currentYear.toString() && (
                        <span className="ml-2 text-xs text-blue-600">({t("currentYear")})</span>
                      )}
                    </label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("year")} />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                            {year.value === currentYear.toString() && (
                              <span className="ml-2 text-xs text-blue-600">({t("current")})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={refreshData}
                    disabled={holidaysLoading || !selectedCountry}
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${holidaysLoading ? "animate-spin" : ""}`} />
                    {t("update")}
                  </Button>
                </CardContent>
              </Card>

              {/* Data Availability Warning */}
              {!dataAvailable && !holidaysLoading && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t("noDataWarning")} {selectedCountryName} {t("forYear")} {selectedYear}.
                  </AlertDescription>
                </Alert>
              )}

              {/* Summary Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        {selectedYear}
                        {selectedYear === currentYear.toString() && (
                          <span className="ml-2 text-xs text-blue-600">({t("current")})</span>
                        )}
                      </p>
                      <p className="text-sm text-blue-700">{t("selectedYear")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">
                        {selectedCountryName}
                        {countryDetected && selectedCountry === originalDetectedCountry && (
                          <span className="ml-2 text-xs text-green-600">({t("detected")})</span>
                        )}
                      </p>
                      <p className="text-sm text-green-700">{t("selectedCountry")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Hash className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">
                        {holidaysLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : holidays.length}
                      </p>
                      <p className="text-sm text-red-700">{t("holidays")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Holiday List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{t("holidaysList")}</span>
                    {holidaysLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </CardTitle>
                  <CardDescription>
                    {t("completeYearList")} {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {holidaysLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-600" />
                        <p className="text-sm text-gray-500">{t("loadingShort")}</p>
                      </div>
                    ) : holidays.length > 0 ? (
                      holidays.map((holiday, index) => {
                        const date = new Date(holiday.date + "T00:00:00")
                        const monthNames = getMonths("short")

                        return (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-red-500">
                            <p className="font-medium text-gray-900 text-sm">{holiday.localName || holiday.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {date.getDate()} de {monthNames[date.getMonth()]}
                            </p>
                            {holiday.global && (
                              <Badge variant="secondary" className="mt-2 text-xs bg-blue-100 text-blue-800">
                                {t("national")}
                              </Badge>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">{t("noDataAvailable")}</p>
                        <p className="text-xs text-gray-400 mt-2">{t("tryDifferentYear")}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {t("legend")}
                    <Info className="h-4 w-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                      <span className="text-sm text-gray-600">{t("holiday")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded ring-1 ring-blue-300"></div>
                      <span className="text-sm text-gray-600">{t("today")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{t("indicator")}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-800">💡 {t("clickHolidayForInfo")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Calendar Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Holiday Information Section */}
              {selectedCountry && <HolidayInfo countryCode={selectedCountry} />}
              
              <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9313218960938213"
                data-ad-slot="3205064408"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
              </script>
              {/* Error Alert */}
              {holidaysError && (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{holidaysError}</AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    {t("annualCalendar")} {selectedYear} - {selectedCountryName}
                  </CardTitle>
                  <CardDescription>{t("fullYearView")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {holidaysLoading && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Array.from({ length: 12 }, (_, month) => (
                        <MonthCalendar
                          key={month}
                          year={Number.parseInt(selectedYear)}
                          month={month}
                          holidays={holidayDates}
                          holidayDetails={holidays}
                          onDateClick={handleDateClick}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today Info Section */}
              <TodayInfo />

              {/* API Attribution */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  {t("apiAttribution")}{" "}
                  <a
                    href="https://date.nager.at"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:underline font-medium"
                  >
                    Nager.Date API
                  </a>
                </p>
              </div>

              {/* FAQ Section */}
              <FAQ />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Estilos CSS personalizados para animaciones */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
