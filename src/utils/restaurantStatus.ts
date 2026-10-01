import type { DbSettings } from '@/services/database'

const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export function isRestaurantOpen(settings: { status_mode: string; opening_hours: { day: string; hours: string; open: boolean }[] }): boolean {
  if (settings.status_mode === 'open') return true
  if (settings.status_mode === 'closed') return false

  // Auto mode: check current day/time
  const now = new Date()
  const dayName = dayNames[now.getDay()]
  const hours = settings.opening_hours?.find((h) => h.day === dayName)
  if (!hours || !hours.open) return false

  // Parse hours like "11:00-23:00" or "14:00-00:00"
  const match = hours.hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!match) return false

  const [, openH, openM, closeH, closeM] = match
  const openMinutes = parseInt(openH) * 60 + parseInt(openM)
  const closeMinutes = parseInt(closeH) * 60 + parseInt(closeM)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Handle midnight wrap (e.g. 14:00-00:00 means closes at midnight)
  if (closeMinutes === 0) {
    return currentMinutes >= openMinutes
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

export function getNextOpeningTime(settings: DbSettings): string | null {
  const now = new Date()
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    const dayName = dayNames[checkDate.getDay()]
    const hours = settings.opening_hours?.find((h) => h.day === dayName)
    if (hours && hours.open) {
      const match = hours.hours.match(/(\d{1,2}):(\d{2})/)
      if (match) {
        return `${dayName} ${match[1]}:${match[2]}`
      }
    }
  }
  return null
}

export function getTodayHours(settings: { opening_hours: { day: string; hours: string; open: boolean }[] }): string {
  const now = new Date()
  const dayName = dayNames[now.getDay()]
  const hours = settings.opening_hours?.find((h) => h.day === dayName)
  if (!hours || !hours.open) return 'مغلق'
  return hours.hours
}
