import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Divider } from './Ornament'
import { Wreath } from './Art'
import PatternBand from './PatternBand'

const EASE = [0.76, 0, 0.24, 1]

/**
 * Ochilish pardasi. Foydalanuvchi tugmani bosgach ko'tariladi —
 * shu bosish musiqani ham ishga tushirish huquqini beradi
 * (brauzerlar avtomatik ovozni bloklaydi).
 */
export default function Curtain({ open, onOpen, groom, bride, monogram }) {
  // Parda yopiq turganda sahifa siljimasin
  useEffect(() => {
    document.body.style.overflow = open ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {/* Yuqoridan va pastdan ochiladigan ikki panel */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-cream"
            exit={{ y: '-100%' }}
            transition={{ duration: 1.3, ease: EASE }}
          >
            <PatternBand className="absolute inset-x-0 top-0" opacity={0.3} />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-cream"
            exit={{ y: '100%' }}
            transition={{ duration: 1.3, ease: EASE }}
          >
            <PatternBand className="absolute inset-x-0 bottom-0" opacity={0.3} />
          </motion.div>

          <motion.div
            className="relative flex flex-col items-center px-8 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5 } }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gulchambar ichidagi bosh harflar */}
            <div className="relative mb-9 flex size-40 items-center justify-center sm:size-48">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              >
                <Wreath className="h-full w-full text-gold/60" />
              </motion.div>
              <span className="font-display text-2xl italic tracking-wide text-gold sm:text-3xl">
                {monogram}
              </span>
            </div>

            <p className="eyebrow mb-6">Taklifnoma</p>

            <h1 className="font-display text-4xl font-light tracking-wide text-ink sm:text-5xl">
              {groom}
              <span className="mx-3 italic text-gold">&</span>
              {bride}
            </h1>

            <Divider className="my-8" width={160} />

            <button
              type="button"
              onClick={onOpen}
              className="group relative overflow-hidden rounded-full border border-gold/50 px-9 py-3.5 text-[0.7rem] tracking-[0.3em] text-ink uppercase transition-colors duration-500 hover:border-gold"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-cream">
                Ochish
              </span>
              <span className="absolute inset-0 -translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
