import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CurlSheet from './CurlSheet'
import { BookContext, PageMotionContext } from './bookContext'

// Qog'ozning og'irligi: boshida biroz qarshilik, oxirida yumshoq to'xtash
// Prujina: qog'ozning og'irligi va oxirida yumshoq joylashishi
const FLIP = { type: 'spring', duration: 1.25, bounce: 0.16 }
const FLIP_FALLBACK_MS = 2200
const SWIPE_THRESHOLD = 45

/**
 * Varaqlanuvchi sahifalar.
 *
 * Varaqlash paytida ikki qatlam ko'rinadi:
 *   - ostki qatlam: ochilayotgan sahifa (oldinga borsak — keyingisi,
 *     orqaga qaytsak — hozirgisi);
 *   - ustki qatlam: egilib ag'darilayotgan varaq (CurlSheet).
 *
 * Sahifa ichidagi tugmalar `useBook()` orqali varaqlay oladi.
 */
export default function Book({ pages, onPageChange }) {
  const [shown, setShown] = useState(0) // ostida ko'rinib turgan sahifa
  const [target, setTarget] = useState(0) // varaqlash yakunida bo'ladigan sahifa
  const [turn, setTurn] = useState(null) // { under, curl, forward }
  const [firstView, setFirstView] = useState(true) // birinchi ochilish
  const progress = useMotionValue(0)
  const pointerStart = useRef(null)

  // Ustidagi varaq ostki sahifaga soya tashlaydi: varaq ko'tarilgani sari
  // ostki sahifa yorishib boradi
  const underShade = useTransform(progress, (p) => 0.68 * (1 - p))

  const total = pages.length
  const turning = turn !== null

  const navigate = useCallback(
    (value, absolute = true) => {
      if (turning) return

      const next = absolute ? value : shown + value
      if (next < 0 || next >= total || next === shown) return

      const forward = next > shown
      setTarget(next)
      setFirstView(false)
      setTurn({
        under: forward ? next : shown,
        curl: forward ? shown : next,
        forward,
      })

      // Varaqlash tugagach holatni yangilaymiz. Agar animatsiya kadrlari
      // to'xtab qolsa (masalan, brauzer fonga o'tsa), zaxira taymer ishga
      // tushadi — aks holda kitob qulflanib qolardi.
      let done = false
      const finish = () => {
        if (done) return
        done = true
        setShown(next)
        setTurn(null)
      }

      progress.set(forward ? 0 : 1)
      animate(progress, forward ? 1 : 0, { ...FLIP, onComplete: finish })
      setTimeout(finish, FLIP_FALLBACK_MS)

      onPageChange?.(next)
    },
    [turning, shown, total, progress, onPageChange]
  )

  const api = useMemo(
    () => ({
      next: () => navigate(1, false),
      prev: () => navigate(-1, false),
      go: (i) => navigate(i, true),
    }),
    [navigate]
  )

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

    navigate(dx < 0 ? 1 : -1, false)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') navigate(1, false)
    if (event.key === 'ArrowLeft') navigate(-1, false)
  }

  return (
    <BookContext value={api}>
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden bg-blush"
        onKeyDown={onKeyDown}
        tabIndex={-1}
      >
        {/* Varaqning o'lchami: telefonda butun ekran, kattaroq ekranda karta */}
        <div
          className="relative h-[100svh] w-full max-w-[27rem] [perspective:1400px] sm:h-[min(100svh,52rem)] sm:rounded-lg sm:shadow-[0_30px_80px_-40px_rgba(120,80,90,0.55)]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* Ostki qatlam */}
          <PageMotionContext value={turn ? turn.forward : firstView}>
            <div className="no-scrollbar absolute inset-0 overflow-y-auto [scrollbar-width:none]">
              {pages[turn ? turn.under : shown]}
            </div>
          </PageMotionContext>

          {/* Ustidagi varaqning soyasi */}
        {turn && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-[rgb(78,52,62)] via-[rgba(78,52,62,0.72)] to-[rgba(78,52,62,0.58)]"
            style={{ opacity: underShade }}
          />
        )}

        {/* Ag'darilayotgan varaq */}
          {turn && (
            <PageMotionContext value={false}>
              <CurlSheet progress={progress} forward={turn.forward}>
                {pages[turn.curl]}
              </CurlSheet>
            </PageMotionContext>
          )}

          {/* Varaqlash boshqaruvi */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-5">
            <NavButton
              direction="prev"
              disabled={target === 0}
              onClick={() => navigate(-1, false)}
            />

            <div className="flex items-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1}-sahifa`}
                  aria-current={i === target}
                  onClick={() => navigate(i)}
                  className={`pointer-events-auto h-1.5 rounded-full transition-all duration-500 ${
                    i === target ? 'w-5 bg-gold' : 'w-1.5 bg-gold/35 hover:bg-gold/60'
                  }`}
                />
              ))}
            </div>

            <NavButton
              direction="next"
              disabled={target === total - 1}
              onClick={() => navigate(1, false)}
            />
          </div>
        </div>
      </div>
    </BookContext>
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
