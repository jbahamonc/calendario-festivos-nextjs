interface CountryInfo {
  title: string
  description: string
  details: string[]
}

interface CountryTranslations {
  es: CountryInfo
  en: CountryInfo
}

export const countryData: Record<string, CountryTranslations> = {
  MX: {
    es: {
      title: "Días Festivos en México",
      description: "México cuenta con una rica variedad de días festivos que reflejan su historia y cultura.",
      details: [
        "Los días festivos oficiales están establecidos en el artículo 74 de la Ley Federal del Trabajo",
        "Incluyen fechas históricas importantes como la Independencia y la Revolución",
        "Las celebraciones combinan eventos civiles y religiosos importantes"
      ]
    },
    en: {
      title: "Holidays in Mexico",
      description: "Mexico has a rich variety of holidays that reflect its history and culture.",
      details: [
        "Official holidays are established in Article 74 of the Federal Labor Law",
        "Include important historical dates such as Independence and Revolution",
        "Celebrations combine important civil and religious events"
      ]
    }
  },
  CO: {
    es: {
      title: "Días Festivos en Colombia",
      description: "Colombia celebra diversos festivos que representan su herencia católica e historia.",
      details: [
        "Los días festivos se rigen por la Ley 51 de 1983",
        "Muchas festividades religiosas se trasladan al lunes siguiente",
        "Combina celebraciones patrióticas y religiosas"
      ]
    },
    en: {
      title: "Holidays in Colombia",
      description: "Colombia celebrates various holidays that represent its Catholic heritage and history.",
      details: [
        "Holidays are governed by Law 51 of 1983",
        "Many religious festivities are moved to the following Monday",
        "Combines patriotic and religious celebrations"
      ]
    }
  },
  ES: {
    es: {
      title: "Días Festivos en España",
      description: "España tiene un calendario festivo que varía por comunidad autónoma.",
      details: [
        "Los festivos incluyen celebraciones nacionales, autonómicas y locales",
        "Cada región tiene sus propias festividades tradicionales",
        "Combina festividades religiosas y civiles importantes"
      ]
    },
    en: {
      title: "Holidays in Spain",
      description: "Spain has a holiday calendar that varies by autonomous community.",
      details: [
        "Holidays include national, regional, and local celebrations",
        "Each region has its own traditional festivities",
        "Combines important religious and civil festivities"
      ]
    }
  },
  AR: {
    es: {
      title: "Días Festivos en Argentina",
      description: "Argentina tiene un sistema de feriados que celebra su historia y diversidad cultural.",
      details: [
        "Los feriados nacionales están regulados por el Decreto 1584/2010",
        "Incluye días no laborables para diferentes comunidades religiosas",
        "Existe un sistema de feriados con fines turísticos (feriados puente)"
      ]
    },
    en: {
      title: "Holidays in Argentina",
      description: "Argentina has a holiday system that celebrates its history and cultural diversity.",
      details: [
        "National holidays are regulated by Decree 1584/2010",
        "Includes non-working days for different religious communities",
        "Features a system of holidays for tourism purposes (bridge holidays)"
      ]
    }
  },
  PE: {
    es: {
      title: "Días Festivos en Perú",
      description: "Perú celebra feriados que honran su historia, tradiciones y diversidad cultural.",
      details: [
        "Los feriados están establecidos en el Decreto Legislativo Nº 713",
        "Incluye celebraciones importantes como Fiestas Patrias y Santa Rosa de Lima",
        "Combina festividades religiosas católicas y celebraciones culturales andinas"
      ]
    },
    en: {
      title: "Holidays in Peru",
      description: "Peru celebrates holidays that honor its history, traditions, and cultural diversity.",
      details: [
        "Holidays are established in Legislative Decree No. 713",
        "Includes important celebrations such as National Holidays and Saint Rose of Lima",
        "Combines Catholic religious festivities and Andean cultural celebrations"
      ]
    }
  }
}