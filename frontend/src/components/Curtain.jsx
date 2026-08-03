import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Divider } from './Ornament'
import { Wreath } from './Art'
import PatternBand from './PatternBand'
import { asset } from '../lib/asset'

const EASE = [0.76, 0, 0.24, 1]
const SLIDE = { duration: 1, ease: EASE }

/**
 * Pardaning yarmi: to'liq balandlikdagi rasmning yuqori yoki quyi qismi.
 * Ikki yarim birga bitta butun rasmni hosil qiladi — parda ochilganda
 * rasm o'rtasidan bo'linib, ikki tomonga siljiydi.
 */
function CoverHalf({ half, image, veil, position }) {
  const veilColor = `rgba(251, 248, 244, ${veil})`
  const denseVeil = `rgba(251, 248, 244, ${Math.min(1, veil + 0.12)})`

  return (
    <div
      className={`absolute inset-x-0 h-[200%] ${half === 'top' ? 'top-0' : 'bottom-0'}`}
      aria-hidden="true"
    >
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover"
        style={{ objectPosition: position }}
      />
      {/* Oq parda: matn o'qilishi uchun markaz qalinroq */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            ${veilColor} 0%,
            ${denseVeil} 35%,
            ${denseVeil} 82%,
            ${veilColor} 100%)`,
        }}
      />
    </div>
  )
}

/**
 * Ochilish pardasi. Foydalanuvchi tugmani bosgach parda ikkiga bo'linib
 * ochiladi — shu bosish musiqani ham ishga tushirish huquqini beradi
 * (brauzerlar avtomatik ovozni bloklaydi).
 */
export default function Curtain({ open, onOpen, groom, bride, monogram, cover }) {
  const [imageReady, setImageReady] = useState(false)

  const image = cover?.image ? asset(cover.image) : null

  // Rasmni oldindan yuklaymiz — yarim yuklangan holda ko'rinib qolmasin
  useEffect(() => {
    if (!image) return

    const img = new Image()
    img.onload = () => setImageReady(true)
    img.src = image
  }, [image])

  // Parda yopiq turganda sahifa siljimasin
  useEffect(() => {
    document.body.style.overflow = open ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const showImage = Boolean(image) && imageReady
  const halfProps = {
    image,
    veil: cover?.veil ?? 0.6,
    position: cover?.position ?? 'center',
  }

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: 0.95 }}
        >
          {/* Yuqoridan va pastdan ochiladigan ikki panel */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-cream"
            exit={{ y: '-100%' }}
            transition={SLIDE}
          >
            {showImage && <CoverHalf half="top" {...halfProps} />}
            <PatternBand className="absolute inset-x-0 top-0" opacity={0.3} />
          </motion.div>

          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-cream"
            exit={{ y: '100%' }}
            transition={SLIDE}
          >
            {showImage && <CoverHalf half="bottom" {...halfProps} />}
            <PatternBand className="absolute inset-x-0 bottom-0" opacity={0.3} />
          </motion.div>

          <motion.div
            className="relative isolate flex flex-col items-center px-8 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Matnni rasmdan ajratib turadigan yumshoq yorug'lik */}
            {showImage && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(251,248,244,0.92) 0%, rgba(251,248,244,0.72) 45%, rgba(251,248,244,0) 78%)',
                }}
              />
            )}

            {/* Gulchambar ichidagi bosh harflar */}
            <div className="relative mb-9 flex size-36 items-center justify-center sm:size-44">
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
              className="group relative overflow-hidden rounded-full border border-gold/60 bg-cream/70 px-9 py-3.5 text-[0.7rem] tracking-[0.3em] text-ink uppercase backdrop-blur-sm transition-colors duration-500 hover:border-gold"
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
