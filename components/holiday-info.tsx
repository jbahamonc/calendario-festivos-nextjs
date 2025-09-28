"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { countryData } from "@/lib/country-data"

export function HolidayInfo({ countryCode }: { countryCode: string }) {
  const { t, language } = useLanguage()
  const currentLang = language === 'en' ? 'en' : 'es'
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)

  useEffect(() => {
    if (countryCode === 'auto') {
      // TODO: Implement actual country detection
      setDetectedCountry('ES')
    }
  }, [countryCode])

  const defaultInfo = {
    title: t("general.holidays"),
    description: t("general.holidaysDescription"),
    details: [
      t("general.holidayDetail1"),
      t("general.holidayDetail2"),
      t("general.holidayDetail3")
    ]
  }

  const effectiveCountryCode = countryCode === 'auto' ? detectedCountry : countryCode
  const info = effectiveCountryCode ? (countryData[effectiveCountryCode]?.[currentLang] || defaultInfo) : defaultInfo

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{info.title}</CardTitle>
        <CardDescription>{info.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 space-y-2">
          {info.details.map((detail, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {detail}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}