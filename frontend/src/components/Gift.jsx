import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import Section from './Section'
import { copyText } from '../lib/clipboard'

export default function Gift({ gift }) {
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
    <Section id="sovga" width="max-w-md">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Tabrik uchun</p>
        </Reveal>

        <Reveal delay={0.1} className="w-full">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Karta raqamidan nusxa olish: ${gift.cardNumber}`}
            className="mt-8 w-full rounded-2xl border border-line bg-white/55 p-7 text-left shadow-[0_18px_50px_-35px_rgba(46,42,37,0.55)] backdrop-blur-sm transition-colors duration-500 hover:border-gold-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl tracking-[0.12em] text-ink tabular-nums sm:text-2xl">
                  {gift.cardNumber}
                </p>
                {gift.cardHolder && (
                  <p className="mt-3 text-[0.65rem] tracking-[0.22em] text-muted uppercase">
                    {gift.cardHolder}
                  </p>
                )}
              </div>

              <span className="mt-1 shrink-0 text-gold">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'ok' : 'copy'}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.25 }}
                    className="block"
                  >
                    {copied ? (
                      <Check size={18} strokeWidth={1.5} />
                    ) : (
                      <Copy size={18} strokeWidth={1.5} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </button>
        </Reveal>

        <Reveal delay={0.15}>
          <p aria-live="polite" className="mt-5 h-4 text-[0.7rem] tracking-[0.2em] text-muted uppercase">
            {copied ? 'Raqam nusxalandi' : 'Nusxalash uchun bosing'}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
