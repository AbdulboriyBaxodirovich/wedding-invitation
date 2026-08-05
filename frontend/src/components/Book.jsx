import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CurlSheet from './CurlSheet'
import { BookContext, PageMotionContext } from './bookContext'

// Qog'ozning og'irligi va oxirida yumshoq joylashishi.
// DIQQAT: bu yerda prujina (`type: 'spring'`) emas, oddiy vaqt asosidagi
// (tween) animatsiya ishlatiladi. Prujinada `visualDuration` MotionValue'ni
// bevosita animatsiya qilishda ishonchsiz chiqdi — o'lchov shuni ko'rsatdiki,
// "2 soniya" belgilanganda animatsiya haqiqatda ancha uzoqroq davom etardi.
// Tweenda esa `duration` sekundda va aynan shu qiymatga teng vaqtda tugaydi
// — shuning uchun natija aniq va oldindan aytiladigan.
const FLIP = { duration: 2, ease: [0.34, 1.4, 0.64, 1] }
const FLIP_FALLBACK_MS = FLIP.duration * 1000 + 400
const SWIPE_THRESHOLD = 45
const AUTO_ADVANCE_MS = 10000

/**
 * Varaqlanuvchi sahifalar.
 *
 * `progress` doim 0 (tekis, hozirgi holat) dan 1 (to'liq ag'darilgan)
 * gacha o'zgaradi — yo'nalishdan qat'i nazar. Shu tufayli:
 *   - ostki qatlam har doim YAKUNIY sahifani (turn.to) ko'rsatadi va
 *     varaqlash tugagach qaytadan qurilmaydi — "yonib-o'chish" bo'lmaydi;
 *   - ustki qatlamdagi varaq har doim HOZIRGI sahifani (turn.from)
 *     ko'rsatadi va harakat boshida (progress=0) ostidagi bilan bir xil,
 *     shuning uchun boshlanishi ham uzilishsiz.
 * Aylanish yo'nalishi (soat bo'yicha yoki teskari) `forward` bilan
 * belgilanadi — bu CurlSheet'ning o'zida hal qilinadi.
 *
 * Muqova (0-sahifa) dan keyin har bir sahifa 10 soniyadan so'ng o'zi
 * varaqlanadi; foydalanuvchi tugma yoki surish bilan istalgan payt
 * qo'lda o'tishi mumkin — bu holda hisoblagich navbatdagi sahifadan
 * qaytadan boshlanadi.
 *
 * Sahifa ichidagi tugmalar `useBook()` orqali varaqlay oladi.
 */
export default function Book({ pages, onPageChange }) {
  const [shown, setShown] = useState(0) // ostida ko'rinib turgan sahifa
  const [target, setTarget] = useState(0) // varaqlash yakunida bo'ladigan sahifa
  const [turn, setTurn] = useState(null) // { from, to, forward }
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
      setTurn({ from: shown, to: next, forward })

      // Varaqlash aynan FLIP.duration dan keyin tugadi deb hisoblanadi —
      // aniq va oldindan aytiladigan bo'lishi uchun `onComplete` emas, shu
      // vaqtga moslashtirilgan taymerga tayanamiz.
      let done = false
      progress.set(0)
      const controls = animate(progress, 1, FLIP)
      const finish = () => {
        if (done) return
        done = true
        controls.stop()
        setShown(next)
        setTurn(null)
      }

      setTimeout(finish, FLIP.duration * 1000)
      // Juda kam holatlar uchun (masalan, sahifa fonda muzlab qolsa)
      // qo'shimcha xavfsizlik chegarasi.
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

  // Muqovadan keyin har bir sahifa 10 soniyada o'zi varaqlanadi.
  // Qo'lda o'tilsa, `shown` o'zgaradi va hisoblagich qaytadan boshlanadi.
  useEffect(() => {
    if (shown === 0 || shown === total - 1) return

    const id = setTimeout(() => navigate(1, false), AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [shown, total, navigate])

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
          {/* Ostki qatlam — varaqlash yakunida ko'rinadigan sahifa.
              Har doim shu ekanligi tufayli varaqlash tugagach qaytadan
              qurilmaydi. */}
          <PageMotionContext value={turn ? turn.forward : firstView}>
            <div className="no-scrollbar absolute inset-0 overflow-y-auto [scrollbar-width:none]">
              {pages[turn ? turn.to : shown]}
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

          {/* Ag'darilayotgan varaq — har doim hozirgi (from) sahifani
              ko'rsatadi, shuning uchun harakat ostidagi bilan bir xil
              holatda boshlanadi */}
          {turn && (
            <PageMotionContext value={false}>
              <CurlSheet progress={progress} forward={turn.forward}>
                {pages[turn.from]}
              </CurlSheet>
            </PageMotionContext>
          )}

          {/* Karta chegarasidan tashqarisini yopadigan pardalar. Varaq
              aylanayotganda perspektiva tufayli karta chetidan chiqib
              ketadi — bu pardalar uni to'rt tomondan ham yashiradi. */}
          {[
            'right-full top-[-100vh] h-[300vh] w-screen',
            'left-full top-[-100vh] h-[300vh] w-screen',
            'bottom-full left-[-100vw] h-screen w-[300vw]',
            'top-full left-[-100vw] h-screen w-[300vw]',
          ].map((position) => (
            <div
              key={position}
              aria-hidden="true"
              className={`pointer-events-none absolute z-20 bg-blush ${position}`}
            />
          ))}

          {/* Boshqaruv ikkinchi varaqdan boshlab ko'rinadi — birinchi
              sahifada "Ochish" tugmasining o'zi yetarli */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-5 transition-opacity duration-700 ${
              target > 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
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
