import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageFrame from './PageFrame'
import Reveal from '../Reveal'
import { Divider } from '../Ornament'
import { copyText } from '../../lib/clipboard'

/** Karta raqamini o'qishga qulay qilib 4 talab ajratamiz */
const formatCard = (value) => value.replace(/\s+/g, '').replace(/(.{4})(?=.)/g, '$1 ')

/** 4-varaq: manzil va tabrik uchun karta */
export default function PlacePage({ event, gift, closing, background }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(id)
  }, [copied])

  const handleCopy = async () => {
    const ok = await copyText(gift.cardNumber.replace(/\s/g, ''))
    setCopied(ok)
  }

  return (
    <PageFrame image={background?.image}>
      <Reveal>
        <p className="eyebrow">Manzil</p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-6 font-display text-2xl font-light text-ink sm:text-3xl">
          {event.venue}
        </h2>
        {event.address && (
          <p className="text-balance mt-3 text-[0.8rem] leading-relaxed text-muted">
            {event.address}
          </p>
        )}
      </Reveal>

      <Reveal delay={0.14} className="w-full">
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink py-3.5 text-[0.65rem] tracking-[0.25em] text-white uppercase transition-all duration-500 hover:bg-gold"
        >
          <MapPin size={14} strokeWidth={1.5} />
          Xaritada koʻrish
        </a>
      </Reveal>

      {gift?.cardNumber && (
        <Reveal delay={0.2} className="w-full">
          <Divider className="my-7" width={110} />
          <p className="eyebrow text-[0.55rem]">Tabrik uchun</p>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Karta raqamidan nusxa olish: ${gift.cardNumber}`}
            className="mt-4 w-full rounded-xl border border-white/70 bg-white/45 p-4 backdrop-blur-[2px] transition-colors duration-500 hover:border-gold/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <p className="font-display text-lg tracking-[0.1em] text-ink tabular-nums">
                  {formatCard(gift.cardNumber)}
                </p>
                {gift.cardHolder && (
                  <p className="mt-1.5 text-[0.58rem] tracking-[0.2em] text-muted uppercase">
                    {gift.cardHolder}
                  </p>
                )}
              </div>

              <span className="shrink-0 text-gold">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'ok' : 'copy'}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.25 }}
                    className="block"
                  >
                    {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </button>

          <p aria-live="polite" className="mt-3 h-3 text-[0.58rem] tracking-[0.2em] text-muted uppercase">
            {copied ? 'Raqam nusxalandi' : 'Nusxalash uchun bosing'}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.26} className="flex flex-col items-center">
        <Divider className="mt-8 mb-6" width={130} />
        <h3 className="font-display text-xl font-light tracking-wide text-ink">{closing.title}</h3>
        <p className="text-balance mt-3 font-display text-sm leading-relaxed text-muted italic">
          {closing.text}
        </p>
      </Reveal>
    </PageFrame>
  )
}
