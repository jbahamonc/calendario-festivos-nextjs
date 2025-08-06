"use client"

import { CalendarDays } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Logo y descripción */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="bg-amber-600 rounded-full p-2">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t("title")}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Holiday Calendar</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 max-w-xs mx-auto md:mx-0">{t("footerDescription")}</p>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} {t("title")}
              </p>
              <p className="text-xs text-gray-400">{t("copyright")}</p>
              <p className="text-xs text-gray-500">
                {t("madeWith")} ❤️ {t("forEveryone")}
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              {t("dataProvidedBy")}{" "}
              <a
                href="https://date.nager.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                Nager.Date API
              </a>
            </p>
            <p className="text-xs text-gray-400">{t("version")} 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
