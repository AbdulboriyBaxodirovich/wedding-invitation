import { motion, useScroll, useTransform } from 'framer-motion'
import { Divider } from './Ornament'
import { Wreath } from './Art'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Hero({ started, couple, date }) {
  // Oyna siljishiga bog'laymiz — element o'lchamini o'lchash shart emas,
  // shuning uchun uslublar kech yuklansa ham to'g'ri ishlaydi.
  const { scrollY } = useScroll()

  // Yengil parallaks: pastga siljiganda sarlavha sekinroq ko'tariladi
  const y = useTransform(scrollY, [0, 800], [0, 150])
  const opacity = useTransform(scrollY, [0, 520], [1, 0])
  const wreathScale = useTransform(scrollY, [0, 800], [1, 1.15])

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6">
      <motion.div style={{ y, opacity }} className="relative flex w-full justify-center">
        {/* Ismlar ortidagi gulchambar */}
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(120vw,37rem)] -translate-x-1/2 -translate-y-1/2"
          style={{ scale: wreathScale }}
          initial={{ opacity: 0, rotate: -6 }}
          animate={started ? { opacity: 1, rotate: 0 } : {}}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Wreath className="h-full w-full text-gold/[0.16]" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={started ? 'visible' : 'hidden'}
          className="relative flex flex-col items-center text-center"
        >
          <motion.p variants={item} className="eyebrow">
            Toʻy taklifnomasi
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-12 font-display text-[3.25rem] leading-[0.95] font-light tracking-tight text-ink sm:text-7xl md:text-8xl"
          >
            {couple.groom}
          </motion.h1>

          <motion.span
            variants={item}
            className="my-3 font-display text-3xl italic text-gold sm:text-4xl"
          >
            &
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-[3.25rem] leading-[0.95] font-light tracking-tight text-ink sm:text-7xl md:text-8xl"
          >
            {couple.bride}
          </motion.h1>

          <motion.div variants={item}>
            <Divider className="my-9" width={180} />
          </motion.div>

          <motion.p
            variants={item}
            className="text-[0.7rem] tracking-[0.45em] text-muted uppercase sm:text-xs"
          >
            {date.day} · {date.monthName} · {date.year}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Pastga suring ishorasi */}
      <motion.div className="absolute inset-x-0 bottom-9" style={{ opacity }}>
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: started ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 1.8 }}
        >
          <span className="eyebrow text-[0.6rem]">Pastga suring</span>
          <span className="animate-nudge h-10 w-px bg-linear-to-b from-gold-soft to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
