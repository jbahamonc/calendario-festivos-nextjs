import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

// Definir metadatos para SEO y compartir en redes sociales
export const metadata: Metadata = {
  metadataBase: new URL("https://calendario-festivos.vercel.app"),
  title: {
    default: "Calendario de Días Festivos | Holiday Calendar",
    template: "%s | Calendario de Días Festivos",
  },
  description:
    "Consulta los días festivos oficiales por país y planifica tu año con información actualizada y precisa. Calendario de festivos para más de 20 países.",
  keywords: [
    "calendario",
    "días festivos",
    "feriados",
    "holiday calendar",
    "planificador",
    "calendario anual",
    "festivos oficiales",
  ],
  authors: [{ name: "Calendario Festivos" }],
  creator: "Calendario Festivos",
  publisher: "Calendario Festivos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Calendar",

  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    title: "Calendario de Días Festivos | Holiday Calendar",
    description:
      "Consulta los días festivos oficiales por país y planifica tu año con información actualizada y precisa.",
    siteName: "Calendario de Días Festivos",
    url: "https://calendario-festivos.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Calendario de Días Festivos",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Calendario de Días Festivos | Holiday Calendar",
    description:
      "Consulta los días festivos oficiales por país y planifica tu año con información actualizada y precisa.",
    images: ["/twitter-image.png"],
    creator: "@CalendarioFest",
  },

  // Canonical URL
  alternates: {
    canonical: "https://calendario-festivos.vercel.app",
    languages: {
      "es-ES": "https://calendario-festivos.vercel.app/es",
      "en-US": "https://calendario-festivos.vercel.app/en",
    },
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificación de sitio
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9313218960938213" crossorigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {/* Metadatos estructurados JSON-LD para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Calendario de Días Festivos",
                description:
                  "Consulta los días festivos oficiales por país y planifica tu año con información actualizada y precisa.",
                url: "https://calendario-festivos.vercel.app",
                applicationCategory: "Calendar",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                author: {
                  "@type": "Organization",
                  name: "Calendario Festivos",
                },
              }),
            }}
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
