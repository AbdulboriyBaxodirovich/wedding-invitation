import { MapPin } from 'lucide-react'
import Reveal from './Reveal'
import Section from './Section'

export default function Location({ event }) {
  return (
    <Section id="manzil" width="max-w-md">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Manzil</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-8 font-display text-3xl font-light text-ink sm:text-4xl">
            {event.venue}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-balance mt-4 text-sm leading-relaxed text-muted">{event.address}</p>
        </Reveal>

        <Reveal delay={0.2} className="w-full">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-[0.7rem] tracking-[0.25em] text-cream uppercase transition-all duration-500 hover:bg-gold"
          >
            <MapPin size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
            Xaritada koʻrish
          </a>
        </Reveal>
      </div>
    </Section>
  )
}
