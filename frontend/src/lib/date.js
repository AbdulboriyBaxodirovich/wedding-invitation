import { MONTHS, WEEKDAYS_FULL } from '../config'

/**
 * Sana satrini ('2027-05-15T18:00:00+05:00') vaqt mintaqasidan qat'i nazar
 * bir xil ko'rsatish uchun satrning o'zidan ajratib olamiz. Aks holda
 * chet eldagi mehmonning brauzerida kun bir kunga surilib ketishi mumkin.
 */
export function parseEventDate(iso) {
  const [datePart] = iso.split('T')
  const [year, month, day] = datePart.split('-').map(Number)

  // Hafta kunini UTC orqali hisoblaymiz — mahalliy vaqtga bog'liq emas
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay()

  return {
    year,
    month, // 1–12
    day,
    monthName: MONTHS[month - 1],
    weekday: WEEKDAYS_FULL[weekdayIndex],
    timestamp: new Date(iso).getTime(),
  }
}

/**
 * Oy uchun kalendar katakchalari. Hafta dushanbadan boshlanadi.
 * Oy boshidagi bo'sh kataklar uchun `null` qaytariladi.
 */
export function buildMonthGrid(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const leadingBlanks = (firstWeekday + 6) % 7 // dushanba = 0
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
}

/** Google Calendar'ga qo'shish havolasi (2 soatlik tadbir) */
export function buildCalendarLink({ title, details, location, iso }) {
  const start = new Date(iso)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
