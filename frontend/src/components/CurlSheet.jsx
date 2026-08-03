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

const SEGMENTS = 6
const BEND = 46 // eng kuchli egilish (gradus)

/** i-bo'lakning oldingi bo'lakka nisbatan burilish burchagi */
function segmentAngle(index, count, progress) {
  const total = -180 * progress // varaqning umumiy burilishi
  const even = total / count // har bo'lakka teng ulush
  // Egilish boshida tez kuchayadi, oxiriga borib tekislanadi — qog'ozni
  // chetidan ko'targandagidek (eng kuchli nuqta o'rtadan oldinroq)
  const bend = BEND * Math.sin(Math.PI * Math.pow(progress, 0.72))
  const weight = (index + 0.5) / count - 0.5 // tashqi bo'laklar oldinroq egiladi

  return even + bend * weight
}

/** Yuzaga tushadigan soya: nurdan ko'proq burilgan bo'lak qorong'iroq */
function segmentShade(index, count, progress) {
  return 0.42 * Math.sin(Math.PI * Math.pow(progress, 0.72)) * ((index + 0.6) / count)
}


function Segment({ index, count, progress, children }) {
  const rotateY = useTransform(progress, (p) => segmentAngle(index, count, p))
  const shade = useTransform(progress, (p) => segmentShade(index, count, p))

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
          className="absolute inset-0 bg-[rgb(92,62,72)]"
          style={{ opacity: shade }}
          aria-hidden="true"
        />
      </div>

      {/* Varaqning orqa tomoni */}
      <div
        className="grain absolute inset-y-0 left-0 overflow-hidden bg-linear-to-bl from-white via-blush to-white/85 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        style={{ width: `${slice}%` }}
        aria-hidden="true"
      >
        <motion.div className="absolute inset-0 bg-[rgb(92,62,72)]" style={{ opacity: shade }} />
      </div>

      {/* Keyingi bo'lak — shu bo'lakning o'ng chekkasiga ulanadi */}
      {index + 1 < count && (
        <Segment index={index + 1} count={count} progress={progress}>
          {children}
        </Segment>
      )}
    </motion.div>
  )
}

export default function CurlSheet({ progress, children, segments = SEGMENTS }) {
  // Varaq ag'darilib bo'lgach birdan yo'qolmasin — oxirida yumshoq so'nadi
  const opacity = useTransform(progress, [0, 0.8, 1], [1, 1, 0])
  // Butun varaq yuzadan ko'tariladi (bo'laklar uzilib qolmasligi uchun
  // ko'tarilish faqat shu yerda — umumiy)
  const lift = useTransform(progress, (p) => 40 * Math.sin(Math.PI * Math.pow(p, 0.72)))

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
      style={{ opacity, z: lift }}
    >
      <Segment index={0} count={segments} progress={progress}>
        {children}
      </Segment>
    </motion.div>
  )
}
