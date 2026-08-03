import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Qog'ozning og'irligi: boshida biroz qarshilik, oxirida yumshoq to'xtash.
// z-index butun son bo'lishi shart — uni animatsiyasiz, darhol qo'yamiz.
const FLIP = {
  duration: 1.15,
  ease: [0.42, 0.02, 0.22, 1],
  zIndex: { duration: 0 },
}
const SWIPE_THRESHOLD = 45

/**
 * Varaqlanuvchi sahifalar. Har o'tishda joriy varaq chap chekkasi
 * atrofida aylanib, kitob sahifasidek ag'dariladi.
 *
 * Oldinga: ketayotgan varaq ag'dariladi, yangisi ostidan chiqadi.
 * Orqaga: kelayotgan varaq teskari holatdan qaytib yopiladi.
 */
const variants = {
  enter: (direction) =>
    direction > 0
      ? { rotateY: 0, rotateZ: 0, zIndex: 1 }
      : { rotateY: -180, rotateZ: -1.4, zIndex: 3 },
  // Varaq to'g'rilanayotganda ozgina "yotib" oladi — qog'oz qattiq emas
  center: { rotateY: 0, rotateZ: 0, zIndex: 2 },
  exit: (direction) =>
    direction > 0
      ? { rotateY: -180, rotateZ: [0, -1.6, -0.4, 0], zIndex: 3 }
      : { rotateY: 0, rotateZ: 0, zIndex: 1 },
}

/** Aylanayotgan varaqqa tushadigan soya — yuza yorug'likni "ushlaydi" */
const frontShade = {
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: (direction) => (direction > 0 ? { opacity: [0, 0.5, 0.62, 0.3] } : { opacity: 0 }),
}

const backShade = {
  enter: (direction) => (direction > 0 ? { opacity: 0 } : { opacity: [0.45, 0.2, 0] }),
  center: { opacity: 0 },
  exit: (direction) => (direction > 0 ? { opacity: [0.55, 0.3, 0.08] } : { opacity: 0 }),
}

export default function Book({ pages, index, onChange }) {
  const [direction, setDirection] = useState(1)
  const [flipping, setFlipping] = useState(false)
  const pointerStart = useRef(null)

  const total = pages.length

  const go = useCallback(
    (next) => {
      if (flipping || next < 0 || next >= total || next === index) return
      setDirection(next > index ? 1 : -1)
      setFlipping(true)
      onChange(next)
    },
    [flipping, index, onChange, total]
  )

  // Animatsiya tugamay qolsa ham varaqlash qulflanib qolmasin
  useEffect(() => {
    if (!flipping) return
    const id = setTimeout(() => setFlipping(false), 1300)
    return () => clearTimeout(id)
  }, [flipping])

  // Klaviatura bilan varaqlash
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowRight') go(index + 1)
      if (event.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  // Barmoq bilan surish
  const onPointerDown = (event) => {
    pointerStart.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start) return

    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return

    go(dx < 0 ? index + 1 : index - 1)
  }

  const page = pages[index]

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-blush">
      {/* Varaqning o'lchami: telefonda butun ekran, kattaroq ekranda karta */}
      <div
        className="relative h-[100svh] w-full max-w-[27rem] [perspective:1250px] sm:h-[min(100svh,52rem)] sm:rounded-lg sm:shadow-[0_30px_80px_-40px_rgba(120,80,90,0.55)]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence custom={direction} initial={false} onExitComplete={() => setFlipping(false)}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={FLIP}
            className="absolute inset-0 origin-left [transform-style:preserve-3d]"
          >
            {/* Old tomon — sahifa mazmuni */}
            <div className="no-scrollbar absolute inset-0 overflow-y-auto [backface-visibility:hidden] [scrollbar-width:none]">
              {page}

              <motion.div
                variants={frontShade}
                transition={FLIP}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-l from-[rgba(90,60,70,0.55)] via-[rgba(120,90,100,0.18)] to-transparent"
              />
            </div>

            {/* Orqa tomon — varaqlanayotganda ko'rinadigan bo'sh yuza */}
            <div
              className="grain absolute inset-0 overflow-hidden bg-linear-to-bl from-white via-blush to-white/85 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              aria-hidden="true"
            >
              <motion.div
                variants={backShade}
                transition={FLIP}
                className="absolute inset-0 bg-linear-to-l from-transparent via-[rgba(120,90,100,0.14)] to-[rgba(90,60,70,0.42)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Varaqlash boshqaruvi */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-5">
          <NavButton
            direction="prev"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          />

          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}-sahifa`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-5 bg-gold' : 'w-1.5 bg-gold/35 hover:bg-gold/60'
                }`}
              />
            ))}
          </div>

          <NavButton
            direction="next"
            disabled={index === total - 1}
            onClick={() => go(index + 1)}
          />
        </div>
      </div>
    </div>
  )
}

function NavButton({ direction, disabled, onClick }) {
  const Icon = direction === 'next' ? ChevronRight : ChevronLeft

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'next' ? 'Keyingi sahifa' : 'Oldingi sahifa'}
      className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-gold/30 bg-white/55 text-gold backdrop-blur-sm transition-all duration-300 hover:border-gold/60 disabled:pointer-events-none disabled:opacity-0"
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  )
}
