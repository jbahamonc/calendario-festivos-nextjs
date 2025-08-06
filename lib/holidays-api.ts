// Tipos para la API de días festivos
export interface Holiday {
  date: string
  localName: string
  name: string
  countryCode: string
  fixed: boolean
  global: boolean
  counties?: string[]
  launchYear?: number
  types: string[]
}

export interface Country {
  countryCode: string
  name: string
}

// Función para obtener países disponibles
export async function getAvailableCountries(): Promise<Country[]> {
  try {
    const response = await fetch("https://date.nager.at/api/v3/AvailableCountries")
    if (!response.ok) {
      throw new Error("Error al obtener países disponibles")
    }
    const countries: Country[] = await response.json()

    // Filtrar solo países de habla hispana y algunos otros relevantes
    const relevantCountries = countries.filter((country) =>
      [
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
      ].includes(country.countryCode),
    )

    return relevantCountries.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error("Error fetching countries:", error)
    throw error
  }
}

// Función para obtener días festivos por país y año
export async function getHolidaysByCountryAndYear(countryCode: string, year: number): Promise<Holiday[]> {
  try {
    // Validar que el año esté en un rango razonable
    if (year < 1975 || year > 2050) {
      console.warn(`Year ${year} is outside the supported range (1975-2050)`)
      return []
    }

    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No holiday data available for ${countryCode} in ${year}`)
        return [] // No hay datos para este país/año
      }
      if (response.status === 400) {
        console.warn(`Bad request for ${countryCode} in ${year} - possibly invalid country/year combination`)
        return []
      }
      if (response.status === 429) {
        console.warn("Rate limit exceeded, please try again later")
        throw new Error("Demasiadas solicitudes. Por favor, intenta de nuevo en unos momentos.")
      }

      console.error(`API Error ${response.status} for ${countryCode} in ${year}`)
      throw new Error(`Error al obtener días festivos: ${response.status}`)
    }

    const holidays: Holiday[] = await response.json()

    // Validar que la respuesta sea un array
    if (!Array.isArray(holidays)) {
      console.warn(`Invalid response format for ${countryCode} in ${year}`)
      return []
    }

    return holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    // Si es un error de red o timeout
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error:", error)
      throw new Error("Error de conexión. Verifica tu conexión a internet.")
    }

    console.error("Error fetching holidays:", error)
    throw error
  }
}

// Función para obtener información de un país específico
export async function getCountryInfo(countryCode: string): Promise<any> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null // País no encontrado
      }
      throw new Error("Error al obtener información del país")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching country info:", error)
    throw error
  }
}

// Función para verificar si un año tiene datos disponibles para un país
export async function checkDataAvailability(countryCode: string, year: number): Promise<boolean> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, {
      method: "HEAD", // Solo verificar si existe, sin descargar datos
    })
    return response.ok
  } catch (error) {
    return false
  }
}
