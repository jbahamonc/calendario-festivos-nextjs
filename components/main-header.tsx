"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

interface MainHeaderProps {
  className?: string
}

export function MainHeader({ className = "" }: MainHeaderProps) {
  const { t } = useLanguage()

  return (
    <header className={`${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Calendar className="h-6 w-6 text-amber-400" />
            <span className="font-bold text-lg">HolidayCalendar</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/calendar">
              <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                {t("exploreCalendar")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}