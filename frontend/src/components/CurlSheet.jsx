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

const SEGMENTS = 12
// Varaqning eng kuchli egilishi (gradus). Bo'laklarga taqsimlanganda
// yig'ilib ketmasligi uchun bo'laklar soniga bo'linadi — shunda egilish
// shakli bo'laklar sonidan qat'i nazar bir xil qoladi.
const CURL = 34
const SHADE_RGB = '92, 62, 72'

/**
 * Egilish bosqichi. Oldinga varaqlaganda ham, orqaga qaytganda ham
 * egilish harakat boshida kuchayib, oxiriga borib tekislanadi.
 */
function phaseOf(progress, forward) {
  const t = forward ? progress : 1 - progress
  return Math.sin(Math.PI * Math.pow(Math.min(Math.max(t, 0), 1), 0.72))
}

/** i-bo'lakning oldingi bo'lakka nisbatan burilish burchagi */
function segmentAngle(index, count, progress, forward) {
  const total = -180 * progress // varaqning umumiy burilishi
  const even = total / count // har bo'lakka teng ulush
  const bend = ((8 * CURL) / count) * phaseOf(progress, forward)
  const weight = (index + 0.5) / count - 0.5 // tashqi bo'laklar oldinroq egiladi

  return even + bend * weight
}

/** Yuzaga tushadigan soya: nurdan ko'proq burilgan bo'lak qorong'iroq */
function segmentShade(index, count, progress, forward) {
  const depth = Math.min(Math.max((index + 0.5) / count, 0), 1)
  return 0.44 * phaseOf(progress, forward) * depth
}

function Segment({ index, count, progress, forward, children }) {
  const rotateY = useTransform(progress, (p) => segmentAngle(index, count, p, forward))

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
      <div
        className="absolute inset-y-0 left-0 overflow-hidden [backface-visibility:hidden]"
        style={{ width: `${slice}%` }}
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
      </div>

      {/* Varaqning orqa tomoni */}
      <div
        className="grain absolute inset-y-0 left-0 overflow-hidden bg-linear-to-bl from-white via-blush to-white/85 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        style={{ width: `${slice}%` }}
        aria-hidden="true"
      >
        <motion.div className="absolute inset-0" style={{ backgroundImage: shading }} />
      </div>

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
  // Varaq ag'darilib bo'lgach birdan yo'qolmasin — oxirida yumshoq so'nadi
  const opacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0])
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
