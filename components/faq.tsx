"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Plus, Minus } from "lucide-react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

export function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: t("faq.whatAreHolidays.question"),
      answer: t("faq.whatAreHolidays.answer")
    },
    {
      question: t("faq.howAccurate.question"),
      answer: t("faq.howAccurate.answer")
    },
    {
      question: t("faq.differenceBetweenTypes.question"),
      answer: t("faq.differenceBetweenTypes.answer")
    },
    {
      question: t("faq.howOftenUpdated.question"),
      answer: t("faq.howOftenUpdated.answer")
    },
    {
      question: t("faq.whyNotMyCountry.question"),
      answer: t("faq.whyNotMyCountry.answer")
    },
    {
      question: t("faq.howCalculated.question"),
      answer: t("faq.howCalculated.answer")
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          {t("faq.title")}
        </CardTitle>
        <CardDescription>{t("faq.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden"
            >
              <button
                className={`w-full px-4 py-3 text-left flex items-center justify-between font-medium text-sm hover:bg-gray-50 transition-colors
                  ${openIndex === index ? "bg-amber-50 text-amber-900" : "bg-white text-gray-900"}`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="flex-1">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className={`h-4 w-4 flex-shrink-0 ${openIndex === index ? "text-amber-500" : "text-gray-400"}`} />
                ) : (
                  <Plus className={`h-4 w-4 flex-shrink-0 ${openIndex === index ? "text-amber-500" : "text-gray-400"}`} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 bg-white text-sm text-gray-600 border-t">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}