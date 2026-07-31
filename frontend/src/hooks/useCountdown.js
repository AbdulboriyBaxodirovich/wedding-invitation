import { useEffect, useState } from 'react'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function diff(target) {
  const remaining = target - Date.now()
  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    isPast: false,
  }
}

/** To'y kunigacha qolgan vaqt. Har soniyada yangilanadi. */
export function useCountdown(timestamp) {
  const [value, setValue] = useState(() => diff(timestamp))

  useEffect(() => {
    const id = setInterval(() => setValue(diff(timestamp)), SECOND)
    return () => clearInterval(id)
  }, [timestamp])

  return value
}
