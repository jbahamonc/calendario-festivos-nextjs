// Función para detectar el país del usuario
export const detectUserCountry = async (): Promise<string> => {
  try {
    // Intentar detectar por timezone primero
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneToCountry: { [key: string]: string } = {
      "America/Mexico_City": "MX",
      "America/Bogota": "CO",
      "America/Argentina/Buenos_Aires": "AR",
      "Europe/Madrid": "ES",
      "America/Lima": "PE",
      "America/Santiago": "CL",
      "America/Caracas": "VE",
      "America/Guayaquil": "EC",
      "America/La_Paz": "BO",
      "America/Asuncion": "PY",
      "America/Montevideo": "UY",
      "America/Costa_Rica": "CR",
      "America/Panama": "PA",
      "America/Guatemala": "GT",
      "America/Tegucigalpa": "HN",
      "America/El_Salvador": "SV",
      "America/Managua": "NI",
      "America/Santo_Domingo": "DO",
      "America/Havana": "CU",
      "America/New_York": "US",
      "America/Toronto": "CA",
      "America/Sao_Paulo": "BR",
    }

    if (timezoneToCountry[timezone]) {
      return timezoneToCountry[timezone]
    }

    // Fallback: intentar detectar por idioma del navegador
    const language = navigator.language.toLowerCase()
    const languageToCountry: { [key: string]: string } = {
      "es-mx": "MX",
      "es-co": "CO",
      "es-ar": "AR",
      "es-es": "ES",
      "es-pe": "PE",
      "es-cl": "CL",
      "es-ve": "VE",
      "es-ec": "EC",
      "es-bo": "BO",
      "es-py": "PY",
      "es-uy": "UY",
      "es-cr": "CR",
      "es-pa": "PA",
      "es-gt": "GT",
      "es-hn": "HN",
      "es-sv": "SV",
      "es-ni": "NI",
      "es-do": "DO",
      "es-cu": "CU",
      "en-us": "US",
      "en-ca": "CA",
      "pt-br": "BR",
    }

    if (languageToCountry[language]) {
      return languageToCountry[language]
    }

    // Si el idioma es español genérico, usar Colombia como default
    if (language.startsWith("es")) {
      return "CO"
    }

    // Si el idioma es inglés genérico, usar Estados Unidos como default
    if (language.startsWith("en")) {
      return "US"
    }

    // Si el idioma es portugués, usar Brasil
    if (language.startsWith("pt")) {
      return "BR"
    }

    // Último fallback: intentar usar una API de geolocalización IP (opcional)
    try {
      const geoResponse = await fetch("https://ipapi.co/country_code/", {
        method: "GET",
        headers: {
          Accept: "text/plain",
        },
      })

      if (geoResponse.ok) {
        const countryCode = await geoResponse.text()
        const supportedCountries = [
          "MX",
          "CO",
          "AR",
          "ES",
          "PE",
          "CL",
          "VE",
          "EC",
          "BO",
          "PY",
          "UY",
          "CR",
          "PA",
          "GT",
          "HN",
          "SV",
          "NI",
          "DO",
          "CU",
          "US",
          "CA",
          "BR",
        ]

        if (supportedCountries.includes(countryCode.toUpperCase())) {
          return countryCode.toUpperCase()
        }
      }
    } catch (geoError) {
      console.log("Geolocation detection failed, using fallback")
    }

    // Default final: Colombia
    return "CO"
  } catch (error) {
    console.error("Error detecting user country:", error)
    return "CO" // Fallback por defecto para Colombia
  }
}