import Reveal from './Reveal'
import Section from './Section'
import { Divider } from './Ornament'

export default function Verse({ verse }) {
  return (
    <Section>
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <span className="font-display text-6xl leading-none text-gold-soft select-none">
            &ldquo;
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-balance mt-2 font-display text-2xl leading-relaxed font-light text-ink italic sm:text-[1.75rem]">
            {verse.text}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col items-center">
          <Divider className="my-8" width={120} />
          <p className="eyebrow">{verse.source}</p>
        </Reveal>
      </div>
    </Section>
  )
}
