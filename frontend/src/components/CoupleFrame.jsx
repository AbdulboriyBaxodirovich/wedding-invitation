import { motion } from 'framer-motion'
import { useId } from 'react'
import Reveal from './Reveal'
import Section from './Section'
import { CoupleArt } from './Art'
import { Divider } from './Ornament'

// Sivri (mehrob) tokchasi shakli.
// Ikki nusxa kerak: kesish uchun 0…1 nisbiy koordinatalar,
// chegara chizig'i uchun esa 300×400 — bir tekis masshtab bo'lsagina
// chiziq punktirga aylanib ketmaydi.
const ARCH_UNIT = 'M0,1 L0,0.46 C0,0.2 0.28,0.05 0.5,0 C0.72,0.05 1,0.2 1,0.46 L1,1 Z'
const ARCH_PATH = 'M0,400 L0,184 C0,80 84,20 150,0 C216,20 300,80 300,184 L300,400 Z'

/**
 * Markaziy bezak: mehrob shaklidagi tokchada kuyov-kelin ramziy tasviri.
 * Tasvir CC0 (public domain) — freesvg.org.
 */
export default function CoupleFrame({ couple }) {
  const clipId = useId().replace(/:/g, '')

  return (
    <Section id="juftlik" width="max-w-sm">
      <div className="flex flex-col items-center">
        {/* Shaklni kesish uchun ta'rif */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={ARCH_UNIT} />
            </clipPath>
          </defs>
        </svg>

        <Reveal className="w-full">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[19rem]">
            {/* Tokcha ichi */}
            <div
              className="absolute inset-0 bg-linear-to-b from-shell via-cream to-shell/70"
              style={{ clipPath: `url(#${clipId})` }}
            >
              <div className="absolute inset-0 flex items-end justify-center pb-[9%]">
                <CoupleArt className="h-[74%] w-auto text-gold/85" style={{ aspectRatio: '5 / 8' }} />
              </div>
            </div>

            {/* Tokchaning oltin chekkasi — ko'rinishga kirganda chiziladi */}
            <svg
              className="absolute inset-0 h-full w-full text-gold"
              viewBox="0 0 300 400"
              aria-hidden="true"
            >
              <motion.path
                d={ARCH_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.55 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col items-center">
          <Divider className="mt-10" width={150} />
          <p className="mt-8 font-display text-2xl font-light tracking-wide text-ink">
            {couple.groom}
            <span className="mx-2.5 italic text-gold">&</span>
            {couple.bride}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
