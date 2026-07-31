import Reveal from './Reveal'
import Section from './Section'
import { Divider } from './Ornament'
import { useCountdown } from '../hooks/useCountdown'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ timestamp }) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(timestamp)

  const units = [
    { label: 'kun', value: days },
    { label: 'soat', value: pad(hours) },
    { label: 'daqiqa', value: pad(minutes) },
    { label: 'soniya', value: pad(seconds) },
  ]

  return (
    <Section id="hisob">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">{isPast ? 'Nikoh muborak boʻlsin' : 'Toʻygacha qoldi'}</p>
        </Reveal>

        {isPast ? (
          <Reveal delay={0.1} className="flex flex-col items-center">
            <p className="mt-8 font-display text-2xl leading-relaxed font-light text-ink italic">
              Bu qutlugʻ kun oʻtdi. Kelganingiz uchun minnatdormiz.
            </p>
            <Divider className="mt-8" width={140} />
          </Reveal>
        ) : (
          <Reveal delay={0.1} className="w-full">
            <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-3">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="flex flex-col items-center rounded-t-[2.5rem] rounded-b-xl border border-line/90 bg-white/45 px-1 pt-7 pb-5 shadow-[0_16px_40px_-32px_rgba(46,42,37,0.6)] backdrop-blur-sm"
                >
                  <span className="font-display text-3xl leading-none font-light text-ink tabular-nums sm:text-5xl">
                    {u.value}
                  </span>
                  <span className="mt-3 h-px w-5 bg-gold-soft" />
                  <span className="eyebrow mt-3 text-[0.5rem] sm:text-[0.6rem]">{u.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
