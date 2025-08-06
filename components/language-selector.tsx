"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">{t("spanish")}</SelectItem>
        <SelectItem value="en">{t("english")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
