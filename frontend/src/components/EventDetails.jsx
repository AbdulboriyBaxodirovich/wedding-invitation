import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import Reveal from './Reveal'
import Section from './Section'
import { Sprig } from './Ornament'
import { WEEKDAYS } from '../config'
import { buildMonthGrid, buildCalendarLink } from '../lib/date'

export default function EventDetails({ date, event, couple }) {
  const grid = buildMonthGrid(date.year, date.month)

  const calendarLink = buildCalendarLink({
    title: `${couple.groom} & ${couple.bride} — toʻy marosimi`,
    details: `${event.venue}, ${event.address}`,
    location: event.address,
    iso: event.date,
  })

  return (
    <Section id="sana" width="max-w-md">
      <div className="flex flex-col items-center">
        <Reveal>
          <p className="eyebrow text-center">Marosim kuni</p>
        </Reveal>

        {/* Sana satri: kun nomi | sana | vaqt */}
        <Reveal delay={0.1} className="w-full">
          <div className="mt-10 grid grid-cols-3 items-center border-y border-line py-6 text-center">
            <span className="eyebrow text-[0.6rem] sm:text-[0.65rem]">{date.weekday}</span>
            <span className="border-x border-line font-display text-5xl leading-none font-light text-ink sm:text-6xl">
              {date.day}
            </span>
            <span className="eyebrow text-[0.6rem] sm:text-[0.65rem]">{event.timeLabel}</span>
          </div>
          <p className="mt-4 text-center font-display text-lg tracking-[0.3em] text-gold uppercase">
            {date.monthName} {date.year}
          </p>
        </Reveal>

        {/* Kalendar */}
        <Reveal delay={0.15} className="w-full">
          <div className="relative mt-12 rounded-2xl border border-line/80 bg-white/55 p-6 shadow-[0_18px_50px_-35px_rgba(46,42,37,0.55)] backdrop-blur-sm sm:p-7">
            {/* Burchak bezaklari */}
            <Sprig className="absolute top-2 left-2 size-7 opacity-45" />
            <Sprig className="absolute top-2 right-2 size-7 opacity-45" flip />
            <Sprig className="absolute bottom-2 left-2 size-7 rotate-180 opacity-45" flip />
            <Sprig className="absolute right-2 bottom-2 size-7 rotate-180 opacity-45" />

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((d) => (
                <div key={d} className="pb-3 text-[0.6rem] tracking-[0.15em] text-muted/70 uppercase">
                  {d}
                </div>
              ))}

              {grid.map((day, i) =>
                day === null ? (
                  <div key={`blank-${i}`} />
                ) : (
                  <div
                    key={day}
                    className="relative flex h-9 items-center justify-center font-display text-base"
                  >
                    {day === date.day && (
                      <motion.span
                        aria-hidden="true"
                        className="animate-pulse-ring absolute size-9 rounded-full bg-gold"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                      />
                    )}
                    <span
                      className={
                        day === date.day
                          ? 'relative font-medium text-cream'
                          : 'relative text-ink/75'
                      }
                    >
                      {day}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <a
            href={calendarLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-b border-line pb-1 text-[0.7rem] tracking-[0.2em] text-muted uppercase transition-colors hover:border-gold hover:text-gold"
          >
            <CalendarDays size={14} strokeWidth={1.5} />
            Kalendarga qoʻshish
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
