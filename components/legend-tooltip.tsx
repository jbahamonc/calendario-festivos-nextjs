"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LegendTooltipProps {
  type: "holiday" | "indicator"
}

export function LegendTooltip({ type }: LegendTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  // Función de prueba muy simple
  const testClick = () => {
    alert(`Test click on ${type}`) // Alert para asegurar que funciona
    setIsOpen(!isOpen)
  }

  const getTooltipContent = () => {
    if (type === "holiday") {
      return {
        title: t("tooltips.holiday.title"),
        description: t("tooltips.holiday.description"),
        examples: t("tooltips.holiday.examples").split("|"),
      }
    } else {
      return {
        title: t("tooltips.indicator.title"),
        description: t("tooltips.indicator.description"),
        examples: t("tooltips.indicator.examples").split("|"),
      }
    }
  }

  const content = getTooltipContent()

  return (
    <div className="mb-2">
      {/* Elemento clickeable muy básico */}
      <button
        onClick={testClick}
        className="w-full flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        style={{ cursor: "pointer" }}
      >
        {type === "holiday" ? (
          <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
        ) : (
          <div className="w-2 h-2 bg-red-500 rounded-full ml-1"></div>
        )}
        <span className="text-sm text-gray-700 flex-1">{t(type)}</span>
        <Info className="h-4 w-4 text-blue-500" />
      </button>

      {/* Tooltip simple */}
      {isOpen && (
        <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-900">{content.title}</h4>
            <button onClick={() => setIsOpen(false)} className="text-blue-600 hover:text-blue-800">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-blue-800 mb-3">{content.description}</p>

          <div>
            <p className="text-xs font-medium text-blue-700 mb-1">{t("tooltips.examples")}:</p>
            <ul className="text-xs text-blue-700">
              {content.examples.map((example, index) => (
                <li key={index} className="mb-1">
                  • {example}
                </li>
              ))}
            </ul>
          </div>

          {type === "holiday" && (
            <div className="mt-3 p-2 bg-yellow-100 rounded border border-yellow-300">
              <p className="text-xs text-yellow-800">
                <strong>{t("tooltips.note")}:</strong> {t("tooltips.holiday.note")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
