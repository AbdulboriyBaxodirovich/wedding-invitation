import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createAmbientMusic } from '../lib/music'

const BARS = [0.45, 1, 0.65, 0.85]

/**
 * Fon musiqasi tugmasi.
 *
 * Ikki rejim: `synth` — dutor kuyi brauzerning o'zida sintez qilinadi
 * (fayl kerak emas), `file` — `music.src` dagi audio fayl o'ynatiladi.
 *
 * Musiqa parda ochilgandan keyin boshlanadi: brauzerlar foydalanuvchi
 * bosmaguncha ovoz chiqarishga ruxsat bermaydi.
 */
export default function MusicToggle({ music, started }) {
  const engineRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  // Sintez rejimi doim ishlaydi; fayl rejimida manzil ko'rsatilgan bo'lishi shart
  const configured = music.mode === 'synth' || Boolean(music.src)
  const available = configured && !failed

  // Ovoz manbasini bir marta tayyorlaymiz
  useEffect(() => {
    if (!configured) return

    if (music.mode === 'file') {
      const audio = new Audio(music.src)
      audio.loop = true
      audio.volume = music.volume
      audio.preload = 'auto'
      audio.addEventListener('error', () => setFailed(true))

      engineRef.current = {
        start: () => audio.play(),
        stop: () => audio.pause(),
        dispose: () => audio.pause(),
      }
    } else {
      const ambient = createAmbientMusic({ volume: music.volume })
      engineRef.current = ambient
    }

    return () => {
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [configured, music.mode, music.src, music.volume])

  // Parda ochilganda ijro etishga harakat qilamiz
  useEffect(() => {
    if (!started || !engineRef.current) return

    Promise.resolve(engineRef.current.start())
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [started])

  const toggle = () => {
    const engine = engineRef.current
    if (!engine) return

    if (playing) {
      engine.stop()
      setPlaying(false)
    } else {
      Promise.resolve(engine.start())
        .then(() => setPlaying(true))
        .catch(() => setFailed(true))
    }
  }

  if (!available) return null

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={playing ? 'Musiqani oʻchirish' : 'Musiqani yoqish'}
      aria-pressed={playing}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: started ? 1 : 0, scale: started ? 1 : 0.8 }}
      transition={{ duration: 0.8, delay: started ? 1.6 : 0 }}
      className="fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full border border-line bg-cream/80 text-gold shadow-[0_10px_30px_-18px_rgba(46,42,37,0.8)] backdrop-blur-md transition-colors hover:border-gold-soft sm:right-7 sm:bottom-7"
      style={{ pointerEvents: started ? 'auto' : 'none' }}
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-current"
            animate={
              playing ? { height: [`${h * 45}%`, '100%', `${h * 45}%`] } : { height: '25%' }
            }
            transition={
              playing
                ? { duration: 0.9 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            style={{ height: '25%' }}
          />
        ))}
      </span>
    </motion.button>
  )
}
