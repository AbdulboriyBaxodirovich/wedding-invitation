import { motion, useTransform } from 'framer-motion'

/**
 * Egiluvchan qog'oz varaq.
 *
 * Varaq bir nechta tik bo'lakka bo'linadi. Har bo'lak o'zidan oldingisining
 * o'ng chekkasiga ulanadi va biroz boshqacha burchakda buriladi. Burchaklar
 * yig'indisi doim to'liq burilishga (180°) teng bo'ladi, ular orasidagi farq
 * esa varaqni egik ko'rsatadi — xuddi chekkasidan ko'tarilgan qog'ozdek.
 *
 * O'lchamlar foizda beriladi va har qatlam o'z ota-qatlamiga nisbatan
 * hisoblanadi, shuning uchun bo'laklar orasida yoriq qolmaydi.
 */

const SEGMENTS = 24
const CURL = 34 // varaqning eng kuchli egilishi (gradus)
const FACE_WINDOW = 46 // old va orqa yuz almashadigan oraliq (gradus)
const SHADE_RGB = '92, 62, 72'

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)

/**
 * Egilish bosqichi. Oldinga varaqlaganda ham, orqaga qaytganda ham
 * egilish harakat boshida kuchayib, oxiriga borib tekislanadi.
 */
function phaseOf(progress, forward) {
  const t = forward ? progress : 1 - progress
  return Math.sin(Math.PI * Math.pow(clamp01(t), 0.72))
}

/** i-bo'lakning oldingi bo'lakka nisbatan burilish burchagi */
function segmentAngle(index, count, progress, forward) {
  const total = -180 * progress // varaqning umumiy burilishi
  const even = total / count // har bo'lakka teng ulush
  const bend = ((8 * CURL) / count) * phaseOf(progress, forward)
  const weight = (index + 0.5) / count - 0.5 // tashqi bo'laklar oldinroq egiladi

  return even + bend * weight
}

/** i-bo'lakning ekranga nisbatan umumiy burchagi (barcha oldingilari bilan) */
function cumulativeAngle(index, count, progress, forward) {
  const m = index + 1
  const total = -180 * progress
  const bend = ((8 * CURL) / count) * phaseOf(progress, forward)
  const sumWeights = (m * m) / (2 * count) - 0.5 * m

  return (total * m) / count + bend * sumWeights
}

/**
 * Bo'lak qay darajada orqa tomonga o'girilgan: 0 — old yuz, 1 — orqa yuz.
 * Almashuv keskin emas, keng oraliqda yumshoq o'tadi — aks holda bo'laklar
 * birin-ketin "yonib-o'chgandek" ko'rinadi.
 */
function faceMix(index, count, progress, forward) {
  const angle = Math.abs(cumulativeAngle(index, count, progress, forward))
  return clamp01((angle - (90 - FACE_WINDOW / 2)) / FACE_WINDOW)
}

/** Yuzaga tushadigan soya: nurdan ko'proq burilgan bo'lak qorong'iroq */
function segmentShade(index, count, progress, forward) {
  return 0.44 * phaseOf(progress, forward) * clamp01((index + 0.5) / count)
}

function Segment({ index, count, progress, forward, children }) {
  const rotateY = useTransform(progress, (p) => segmentAngle(index, count, p, forward))
  const frontOpacity = useTransform(progress, (p) => 1 - faceMix(index, count, p, forward))
  const backOpacity = useTransform(progress, (p) => faceMix(index, count, p, forward))

  // Soya qo'shni bo'lakning darajasidan boshlanadi — shunda bo'laklar
  // chegarasi bilinmaydi, yorug'lik butun varaq bo'ylab silliq o'tadi
  const shading = useTransform(progress, (p) => {
    const from = segmentShade(index - 1, count, p, forward)
    const to = segmentShade(index, count, p, forward)
    return `linear-gradient(to right, rgba(${SHADE_RGB}, ${from}), rgba(${SHADE_RGB}, ${to}))`
  })

  const remaining = count - index // shu qatlamda qolgan bo'laklar
  const slice = 100 / remaining // bitta bo'lakning shu qatlamdagi eni, %
  const parentSlice = 100 / (remaining + 1) // ota qatlamdagi bo'lak eni, %
  const sliceWidth = `calc(${slice}% + 1px)` // 1px ustma-ust — yoriq qolmasin

  return (
    <motion.div
      className="absolute inset-y-0 origin-left [transform-style:preserve-3d]"
      style={{
        rotateY,
        left: index === 0 ? 0 : `${parentSlice}%`,
        width: index === 0 ? '100%' : `${100 - parentSlice}%`,
      }}
    >
      {/* Varaqning shu bo'lakka to'g'ri keladigan qismi */}
      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: sliceWidth, opacity: frontOpacity }}
      >
        <div
          className="absolute inset-y-0"
          style={{ width: `${100 * count}%`, left: `${-100 * index}%` }}
        >
          {children}
        </div>
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: shading }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Varaqning orqa tomoni */}
      <motion.div
        className="grain absolute inset-y-0 left-0 overflow-hidden bg-linear-to-bl from-white via-blush to-white/85"
        style={{ width: sliceWidth, opacity: backOpacity }}
        aria-hidden="true"
      >
        <motion.div className="absolute inset-0" style={{ backgroundImage: shading }} />
      </motion.div>

      {/* Keyingi bo'lak — shu bo'lakning o'ng chekkasiga ulanadi */}
      {index + 1 < count && (
        <Segment index={index + 1} count={count} progress={progress} forward={forward}>
          {children}
        </Segment>
      )}
    </motion.div>
  )
}

export default function CurlSheet({ progress, forward = true, children, segments = SEGMENTS }) {
  // Varaq oxiriga borib butunligicha, sekin singib yo'qoladi;
  // orqaga qaytganda esa xuddi shunday sekin qaytib chiqadi
  const opacity = useTransform(progress, [0.6, 1], [1, 0])
  // Butun varaq yuzadan ko'tariladi (ko'tarilish har bo'lakka alohida
  // berilsa, ular 3D fazoda uzilib qoladi — shuning uchun umumiy)
  const lift = useTransform(progress, (p) => 42 * phaseOf(p, forward))

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
      style={{ opacity, z: lift }}
    >
      <Segment index={0} count={segments} progress={progress} forward={forward}>
        {children}
      </Segment>
    </motion.div>
  )
}
