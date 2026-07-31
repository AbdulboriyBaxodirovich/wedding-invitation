import Reveal from './Reveal'
import Section from './Section'
import { Divider, Sprig } from './Ornament'
import { Wreath } from './Art'

export default function Closing({ closing, couple, date }) {
  return (
    <Section className="pb-16">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <div className="relative flex size-44 items-center justify-center sm:size-52">
            <Wreath className="absolute inset-0 h-full w-full text-gold/55" />
            <span className="font-display text-2xl italic tracking-wide text-gold sm:text-3xl">
              {couple.monogram}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-10 font-display text-4xl font-light tracking-wide text-ink sm:text-5xl">
            {closing.title}
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col items-center">
          <Divider className="my-8" width={140} />
          <p className="text-balance max-w-sm font-display text-lg leading-relaxed text-muted italic sm:text-xl">
            {closing.text}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex items-end justify-center gap-2 opacity-50">
            <Sprig className="size-9" />
            <Sprig className="size-9" flip />
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 text-[0.6rem] tracking-[0.4em] text-muted/70 uppercase">
            {couple.groom} &amp; {couple.bride} · {date.day}.{String(date.month).padStart(2, '0')}.
            {date.year}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
