import Reveal from './Reveal'
import Section from './Section'
import { Sprig } from './Ornament'

export default function Invitation({ invitation }) {
  return (
    <Section>
      <div className="relative flex flex-col items-center text-center">
        {/* Burchak bezaklari */}
        <Sprig className="absolute -top-4 -left-2 size-12 opacity-40 sm:-left-8" />
        <Sprig className="absolute -right-2 -bottom-4 size-12 rotate-180 opacity-40 sm:-right-8" flip />

        <Reveal>
          <p className="eyebrow">{invitation.title}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-balance mt-8 font-display text-xl leading-[1.7] font-light text-ink sm:text-2xl">
            {invitation.text}
          </p>
        </Reveal>

        {invitation.hosts && (
          <Reveal delay={0.2}>
            <p className="mt-10 text-xs leading-relaxed tracking-wide text-muted">
              {invitation.hosts}
            </p>
          </Reveal>
        )}
      </div>
    </Section>
  )
}
