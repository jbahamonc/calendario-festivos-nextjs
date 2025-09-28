"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, Globe, MapPin, Info } from "lucide-react"

interface HolidayTooltipProps {
  holiday: {
    date: string
    localName: string
    name: string
    global: boolean
  }
  daysUntil?: number
  position: {
    x: number
    y: number
  }
  placement: "top" | "bottom" | "left" | "right"
  onClose: () => void
}

export function HolidayTooltip({ holiday, daysUntil, position, placement, onClose }: HolidayTooltipProps) {
  const { t } = useLanguage()
  const date = new Date(holiday.date)
  
  // Calcular el estilo de posicionamiento
  const getTooltipStyle = () => {
    const offset = 8 // Espacio entre el tooltip y el elemento
    const style: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
    }

    switch (placement) {
      case "top":
        style.left = position.x
        style.bottom = window.innerHeight - position.y + offset
        break
      case "bottom":
        style.left = position.x
        style.top = position.y + offset
        break
      case "left":
        style.right = window.innerWidth - position.x + offset
        style.top = position.y
        break
      case "right":
        style.left = position.x + offset
        style.top = position.y
        break
    }

    return style
  }

  return (
    <Card className="absolute w-72 shadow-lg" style={getTooltipStyle()}>
      <CardContent className="p-4 space-y-3">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{holiday.localName}</h3>
          {holiday.name !== holiday.localName && (
            <p className="text-sm text-gray-600">{holiday.name}</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{date.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span>{holiday.global ? t("national") : t("regional")}</span>
          </div>

          {typeof daysUntil === "number" && (
            <div className="flex items-center gap-2 text-amber-600">
              <Info className="h-4 w-4" />
              <span>
                {daysUntil === 0
                  ? t("today")
                  : daysUntil === 1
                  ? t("tomorrow")
                  : t("daysUntil")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}