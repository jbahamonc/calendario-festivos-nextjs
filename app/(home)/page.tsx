"use client"

import { useLanguage } from "@/contexts/language-context"
import { NextHolidays } from "@/components/next-holidays"
import { HolidaysSummary } from "@/components/holidays-summary"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { countryData } from "@/lib/country-data"
import { MainHeader } from "@/components/main-header"
import { CurrentMonthCalendar } from "@/components/current-month-calendar"
import { HolidaysTable } from "@/components/holidays-table"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section with header */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden mb-8">
        <MainHeader className="bg-transparent border-b border-white/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {t("subtitle")}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{Object.keys(countryData).length}</div>
                <div className="text-blue-100 text-sm">{t("countries")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">365</div>
                <div className="text-blue-100 text-sm">{t("daysYear")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">15+</div>
                <div className="text-blue-100 text-sm">{t("holidaysTotal")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4">

        {/* Two columns section */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <NextHolidays />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <CurrentMonthCalendar />
            </CardContent>
          </Card>
        </section>

        {/* Info section */}
        <section className="mb-16">
          <Card>
            <CardContent className="pt-6">
              <HolidaysSummary />
            </CardContent>
          </Card>
        </section>

        {/* Holidays table section */}
        <section className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <HolidaysTable />
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  )
}