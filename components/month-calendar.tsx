"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { X, Calendar, Clock } from "lucide-react"

interface MonthCalendarProps {
  year: number
  month: number
  holidays: Set<string>
  holidayDetails?: Array<{
    date: string
    localName: string
    name: string
    global: boolean
  }>
  onDateClick?: (date: Date) => void
}

export function MonthCalendar({ year, month, holidays, holidayDetails = [], onDateClick }: MonthCalendarProps) {
  const { getMonths, getDaysOfWeek, t } = useLanguage()
  const [selectedTooltip, setSelectedTooltip] = useState<{
    date: string
    type: "holiday" | "future"
    content: any
    position: { x: number; y: number }
    placement: "top" | "bottom" | "left" | "right"
  } | null>(null)

  const monthNames = getMonths("full")
  const daysOfWeek = getDaysOfWeek()

  // Obtener el primer día del mes y cuántos días tiene
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Obtener la fecha actual
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Crear array de días del mes
  const days = []

  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const isHoliday = (day: number) => {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split("T")[0]
    return holidays.has(dateString)
  }

  const isToday = (day: number) => {
    return day === currentDay && month === currentMonth && year === currentYear
  }

  const isFutureDate = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date > today
  }

  const getHolidayInfo = (day: number) => {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split("T")[0]
    return holidayDetails.find((holiday) => holiday.date === dateString)
  }

  // Función para calcular días restantes
  const getDaysUntilDate = (targetDay: number) => {
    const today = new Date()
    const targetDate = new Date(year, month, targetDay)

    // Resetear las horas para comparar solo fechas
    today.setHours(0, 0, 0, 0)
    targetDate.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Función para calcular la mejor posición del tooltip
  const calculateTooltipPosition = (rect: DOMRect) => {
    const tooltipWidth = 320 // 80 * 4 = w-80
    const tooltipHeight = 200 // Altura estimada del tooltip
    const margin = 16 // Margen de seguridad

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = rect.left + rect.width / 2
    let y = rect.top
    let placement: "top" | "bottom" | "left" | "right" = "top"

    // Verificar si hay espacio arriba
    if (rect.top >= tooltipHeight + margin) {
      placement = "top"
      y = rect.top - margin
    }
    // Si no hay espacio arriba, intentar abajo
    else if (viewportHeight - rect.bottom >= tooltipHeight + margin) {
      placement = "bottom"
      y = rect.bottom + margin
    }
    // Si no hay espacio arriba ni abajo, intentar a la izquierda
    else if (rect.left >= tooltipWidth + margin) {
      placement = "left"
      x = rect.left - margin
      y = rect.top + rect.height / 2
    }
    // Si no hay espacio a la izquierda, colocar a la derecha
    else if (viewportWidth - rect.right >= tooltipWidth + margin) {
      placement = "right"
      x = rect.right + margin
      y = rect.top + rect.height / 2
    }
    // Como último recurso, centrar en la pantalla
    else {
      placement = "top"
      x = viewportWidth / 2
      y = viewportHeight / 2
    }

    // Ajustar X para que no se salga de los bordes
    if (placement === "top" || placement === "bottom") {
      const halfWidth = tooltipWidth / 2
      if (x - halfWidth < margin) {
        x = halfWidth + margin
      } else if (x + halfWidth > viewportWidth - margin) {
        x = viewportWidth - halfWidth - margin
      }
    }

    // Ajustar Y para que no se salga de los bordes
    if (placement === "left" || placement === "right") {
      const halfHeight = tooltipHeight / 2
      if (y - halfHeight < margin) {
        y = halfHeight + margin
      } else if (y + halfHeight > viewportHeight - margin) {
        y = viewportHeight - halfHeight - margin
      }
    }

    return { x, y, placement }
  }

  const handleDateClick = (day: number, event: React.MouseEvent) => {
    const date = new Date(year, month, day)

    if (onDateClick) {
      onDateClick(date)
    }

    // Si es un día festivo, mostrar tooltip de festivo
    if (isHoliday(day)) {
      const holidayInfo = getHolidayInfo(day)
      if (holidayInfo) {
        const rect = event.currentTarget.getBoundingClientRect()
        const position = calculateTooltipPosition(rect)

        setSelectedTooltip({
          date: date.toISOString().split("T")[0],
          type: "holiday",
          content: holidayInfo,
          position: {
            x: position.x,
            y: position.y,
          },
          placement: position.placement,
        })
      }
    }
    // Si es un día futuro (no festivo), mostrar tooltip de días restantes
    else if (isFutureDate(day)) {
      const daysRemaining = getDaysUntilDate(day)
      const rect = event.currentTarget.getBoundingClientRect()
      const position = calculateTooltipPosition(rect)

      setSelectedTooltip({
        date: date.toISOString().split("T")[0],
        type: "future",
        content: {
          day,
          month: monthNames[month],
          year,
          daysRemaining,
        },
        position: {
          x: position.x,
          y: position.y,
        },
        placement: position.placement,
      })
    }
  }

  const closeTooltip = () => {
    setSelectedTooltip(null)
  }

  // Función para obtener el transform según la posición
  const getTooltipTransform = (placement: string) => {
    switch (placement) {
      case "top":
        return "translate(-50%, -100%)"
      case "bottom":
        return "translate(-50%, 0%)"
      case "left":
        return "translate(-100%, -50%)"
      case "right":
        return "translate(0%, -50%)"
      default:
        return "translate(-50%, -50%)"
    }
  }

  // Función para obtener la clase de la flecha según la posición
  const getArrowClasses = (placement: string, type: "holiday" | "future") => {
    const borderColor = type === "holiday" ? "border-red-200" : "border-blue-200"
    const baseClasses = `absolute w-3 h-3 bg-white border transform rotate-45 ${borderColor}`

    switch (placement) {
      case "top":
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0`
      case "bottom":
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0`
      case "left":
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2 border-t-0 border-r-0`
      case "right":
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2 border-b-0 border-l-0`
      default:
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0`
    }
  }

  // Función para obtener las clases CSS del día
  const getDayClasses = (day: number) => {
    const baseClasses = `
      w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center 
      transition-all duration-200 relative
    `

    const isHolidayDay = isHoliday(day)
    const isTodayDay = isToday(day)
    const isFuture = isFutureDate(day)

    if (isHolidayDay && isTodayDay) {
      // Día festivo Y día actual - prioridad al festivo pero con borde azul
      return `${baseClasses} bg-red-100 text-red-700 font-bold border-2 border-blue-500 hover:bg-red-200 hover:scale-110 cursor-pointer ring-2 ring-blue-300 ring-offset-1`
    } else if (isHolidayDay) {
      // Solo día festivo
      return `${baseClasses} bg-red-100 text-red-700 font-bold border-2 border-red-500 hover:bg-red-200 hover:scale-110 cursor-pointer`
    } else if (isTodayDay) {
      // Solo día actual
      return `${baseClasses} bg-blue-100 text-blue-700 font-bold border-2 border-blue-500 hover:bg-blue-200 hover:scale-110 ring-2 ring-blue-300 ring-offset-1`
    } else if (isFuture) {
      // Día futuro (no festivo) - clickeable para mostrar días restantes
      return `${baseClasses} text-gray-700 hover:bg-blue-50 hover:scale-105 cursor-pointer hover:text-blue-700`
    } else {
      // Día pasado o presente normal
      return `${baseClasses} text-gray-700 hover:bg-gray-100 hover:scale-105`
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        {/* Header del mes */}
        <div className="text-center mb-3">
          <h3 className="font-semibold text-gray-900">{monthNames[month]}</h3>
          <p className="text-sm text-gray-500">{year}</p>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square flex items-center justify-center">
              {day && (
                <button
                  onClick={(e) => handleDateClick(day, e)}
                  className={getDayClasses(day)}
                  title={
                    isHoliday(day) && isToday(day)
                      ? `${t("holiday")} - ${t("today")}`
                      : isHoliday(day)
                        ? t("holiday")
                        : isToday(day)
                          ? t("today")
                          : isFutureDate(day)
                            ? t("clickForDaysRemaining")
                            : ""
                  }
                >
                  {day}
                  {isHoliday(day) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                  )}
                  {isToday(day) && !isHoliday(day) && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip para días festivos y días futuros */}
      {selectedTooltip && (
        <>
          {/* Overlay de fondo */}
          <div className="fixed inset-0 z-40" onClick={closeTooltip} />

          {/* Tooltip */}
          <div
            className="fixed z-50 w-80 max-w-[90vw]"
            style={{
              left: `${selectedTooltip.position.x}px`,
              top: `${selectedTooltip.position.y}px`,
              transform: getTooltipTransform(selectedTooltip.placement),
            }}
          >
            <div
              className={`bg-white rounded-lg shadow-2xl border-2 relative ${
                selectedTooltip.type === "holiday" ? "border-red-200" : "border-blue-200"
              }`}
            >
              {/* Flecha del tooltip */}
              <div className={getArrowClasses(selectedTooltip.placement, selectedTooltip.type)}></div>

              {/* Header */}
              <div
                className={`flex items-center justify-between p-4 border-b border-gray-100 rounded-t-lg ${
                  selectedTooltip.type === "holiday" ? "bg-red-50" : "bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedTooltip.type === "holiday" ? "bg-red-500" : "bg-blue-500"
                    }`}
                  ></div>
                  <h3
                    className={`font-semibold ${selectedTooltip.type === "holiday" ? "text-red-900" : "text-blue-900"}`}
                  >
                    {selectedTooltip.type === "holiday" ? t("holiday") : t("futureDate")}
                  </h3>
                </div>
                <button
                  onClick={closeTooltip}
                  className={`p-1 rounded-full transition-colors ${
                    selectedTooltip.type === "holiday"
                      ? "hover:bg-red-100 text-red-600"
                      : "hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {selectedTooltip.type === "holiday" ? (
                  // Contenido para días festivos
                  <>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedTooltip.content.localName || selectedTooltip.content.name}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{t("date")}:</span>
                        <span>{new Date(selectedTooltip.content.date + "T00:00:00").toLocaleDateString()}</span>
                      </div>

                      {selectedTooltip.content.localName !== selectedTooltip.content.name && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">🌍 {t("internationalName")}:</span>
                          <span>{selectedTooltip.content.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="font-medium">🏛️ {t("scope")}:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedTooltip.content.global ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedTooltip.content.global ? t("national") : t("regional")}
                        </span>
                      </div>

                      {/* Días restantes - solo si es futuro */}
                      {(() => {
                        const daysUntil = getDaysUntilDate(
                          new Date(selectedTooltip.content.date + "T00:00:00").getDate(),
                        )
                        if (daysUntil > 0) {
                          return (
                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md border border-amber-200">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <span className="font-medium text-amber-800">{t("daysRemaining")}:</span>
                              <span className="font-bold text-amber-900">
                                {daysUntil} {daysUntil === 1 ? t("day") : t("days")}
                              </span>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-xs text-blue-800 leading-relaxed">💡 {t("holidayTooltip.description")}</p>
                    </div>
                  </>
                ) : (
                  // Contenido para días futuros
                  <>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedTooltip.content.day} de {selectedTooltip.content.month} de {selectedTooltip.content.year}
                    </h4>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{t("date")}:</span>
                        <span>{new Date(year, month, selectedTooltip.content.day).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium text-blue-800">{t("daysRemaining")}:</span>
                          <div className="text-2xl font-bold text-blue-900">
                            {selectedTooltip.content.daysRemaining}{" "}
                            {selectedTooltip.content.daysRemaining === 1 ? t("day") : t("days")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                      <p className="text-xs text-green-800 leading-relaxed">📅 {t("futureDateTooltip.description")}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
