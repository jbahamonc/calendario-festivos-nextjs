import { Holiday } from "./holidays-api"

export function getNextHolidays(holidays: Holiday[], count: number = 5): Holiday[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return holidays
    .filter((holiday) => {
      const holidayDate = new Date(holiday.date)
      holidayDate.setHours(0, 0, 0, 0)
      return holidayDate >= today
    })
    .slice(0, count)
}