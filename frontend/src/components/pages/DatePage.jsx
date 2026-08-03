import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import PageFrame from './PageFrame'
import Reveal from '../Reveal'
import { WEEKDAYS } from '../../config'
import { buildCalendarLink, buildMonthGrid } from '../../lib/date'
import { useCountdown } from '../../hooks/useCountdown'

const pad = (n) => String(n).padStart(2, '0')

/** 3-varaq: to'y sanasi va qolgan vaqt */
export default function DatePage({ date, event, couple, background }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(date.timestamp)
  const grid = buildMonthGrid(date.year, date.month)

  const units = [
    { label: 'kun', value: days },
    { label: 'soat', value: pad(hours) },
    { label: 'daq.', value: pad(minutes) },
    { label: 'son.', value: pad(seconds) },
  ]

  const calendarLink = buildCalendarLink({
    title: `${couple.groom} & ${couple.bride} — toʻy marosimi`,
    details: `${event.venue}, ${event.address}`,
    location: event.address,
    iso: event.date,
  })

  return (
    <PageFrame image={background?.image}>
      <Reveal>
        <p className="eyebrow">Toʻy kuni</p>
      </Reveal>

      {/* Kun nomi | sana | vaqt */}
      <Reveal delay={0.08} className="w-full">
        <div className="mt-6 grid grid-cols-3 items-center border-y border-gold/25 py-4 text-center">
          <span className="eyebrow text-[0.55rem]">{date.weekday}</span>
          <span className="border-x border-gold/25 font-display text-4xl leading-none font-light text-ink">
            {date.day}
          </span>
          <span className="eyebrow text-[0.55rem]">{event.timeLabel}</span>
        </div>
        <p className="mt-3 font-display text-base tracking-[0.3em] text-gold uppercase">
          {date.monthName} {date.year}
        </p>
      </Reveal>

      {/* Kalendar */}
      <Reveal delay={0.14} className="w-full">
        <div className="mt-6 rounded-xl border border-white/70 bg-white/45 px-3 py-4 backdrop-blur-[2px]">
          <div className="grid grid-cols-7 text-center">
            {WEEKDAYS.map((d) => (
              <div key={d} className="pb-2 text-[0.5rem] tracking-[0.1em] text-muted/70 uppercase">
                {d}
              </div>
            ))}

            {grid.map((day, i) =>
              day === null ? (
                <div key={`blank-${i}`} />
              ) : (
                <div
                  key={day}
                  className="relative flex h-7 items-center justify-center font-display text-sm"
                >
                  {day === date.day && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute size-7 rounded-full bg-gold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                    />
                  )}
                  <span
                    className={day === date.day ? 'relative font-medium text-white' : 'relative text-ink/75'}
                  >
                    {day}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </Reveal>

      {/* Qolgan vaqt */}
      <Reveal delay={0.2} className="w-full">
        <p className="eyebrow mt-7 text-[0.55rem]">
          {isPast ? 'Nikoh muborak boʻlsin' : 'Toʻygacha qoldi'}
        </p>

        {!isPast && (
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {units.map((u) => (
              <div
                key={u.label}
                className="flex flex-col items-center rounded-t-2xl rounded-b-md border border-white/70 bg-white/45 px-1 pt-4 pb-2.5 backdrop-blur-[2px]"
              >
                <span className="font-display text-2xl leading-none font-light text-ink tabular-nums">
                  {u.value}
                </span>
                <span className="eyebrow mt-2 text-[0.45rem]">{u.label}</span>
              </div>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal delay={0.26}>
        <a
          href={calendarLink}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 border-b border-gold/30 pb-1 text-[0.62rem] tracking-[0.2em] text-muted uppercase transition-colors hover:border-gold hover:text-gold"
        >
          <CalendarDays size={13} strokeWidth={1.5} />
          Kalendarga qoʻshish
        </a>
      </Reveal>
    </PageFrame>
  )
}
