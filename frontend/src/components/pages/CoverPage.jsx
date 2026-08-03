import { motion } from 'framer-motion'
import PageFrame from './PageFrame'
import PatternBand from '../PatternBand'
import { Divider } from '../Ornament'
import { Wreath } from '../Art'

/** 1-varaq: ochilish oynasi */
export default function CoverPage({ couple, cover, onOpen }) {
  return (
    <PageFrame image={cover?.image} fit="cover" veil={0.1} glow={0.75} className="!py-[9%]">
      <PatternBand className="absolute inset-x-0 top-0" opacity={0.3} />
      <PatternBand className="absolute inset-x-0 bottom-0" opacity={0.3} />

      <motion.div
        className="relative isolate flex flex-col items-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Matnni rasmdan ajratib turadigan yumshoq yorug'lik */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,251,252,0.92) 0%, rgba(255,251,252,0.72) 45%, rgba(255,251,252,0) 78%)',
          }}
        />

        {/* Gulchambar ichidagi bosh harflar */}
        <div className="relative mb-8 flex size-32 items-center justify-center sm:size-40">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <Wreath className="h-full w-full text-gold/60" />
          </motion.div>
          <span className="font-display text-2xl italic tracking-wide text-gold sm:text-3xl">
            {couple.monogram}
          </span>
        </div>

        <p className="eyebrow mb-5">Taklifnoma</p>

        <h1 className="font-display text-[2.1rem] leading-tight font-light tracking-wide text-ink sm:text-5xl">
          {couple.groom}
          <span className="mx-2.5 italic text-gold">&</span>
          {couple.bride}
        </h1>

        <Divider className="my-7" width={150} />

        <button
          type="button"
          onClick={onOpen}
          className="group relative overflow-hidden rounded-full border border-gold/60 bg-white/60 px-8 py-3.5 text-[0.7rem] tracking-[0.3em] text-ink uppercase backdrop-blur-sm transition-colors duration-500 hover:border-gold"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
            Ochish
          </span>
          <span className="absolute inset-0 -translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        </button>
      </motion.div>
    </PageFrame>
  )
}
