import PageFrame from './PageFrame'
import Reveal from '../Reveal'
import { Divider } from '../Ornament'

/** 2-varaq: taklif so'zlari va oyat */
export default function WordsPage({ invitation, verse, background }) {
  return (
    <PageFrame image={background?.image}>
      <Reveal>
        <p className="eyebrow">{invitation.title}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-balance mt-7 font-display text-[1.05rem] leading-[1.75] font-light text-ink sm:text-xl">
          {invitation.text}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <Divider className="my-8" width={130} />
      </Reveal>

      <Reveal delay={0.24}>
        <p className="text-balance font-display text-base leading-relaxed text-ink/80 italic sm:text-lg">
          «{verse.text}»
        </p>
        <p className="mt-4 text-[0.6rem] tracking-[0.3em] text-muted uppercase">{verse.source}</p>
      </Reveal>

      {invitation.hosts && (
        <Reveal delay={0.3}>
          <p className="mt-9 text-[0.7rem] leading-relaxed tracking-wide text-muted">
            {invitation.hosts}
          </p>
        </Reveal>
      )}
    </PageFrame>
  )
}
