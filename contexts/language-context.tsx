"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  getMonths: (type: "full" | "short") => string[]
  getDaysOfWeek: () => string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  // Cargar idioma desde localStorage al montar
  useEffect(() => {
    const savedLanguage = localStorage.getItem("calendar-language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Guardar idioma en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("calendar-language", language)
  }, [language])

  // Función para obtener traducciones
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  // Función para obtener meses
  const getMonths = (type: "full" | "short"): string[] => {
    return translations[language].months[type]
  }

  // Función para obtener días de la semana
  const getDaysOfWeek = (): string[] => {
    return translations[language].daysOfWeek
  }

  const value = {
    language,
    setLanguage,
    t,
    getMonths,
    getDaysOfWeek,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
