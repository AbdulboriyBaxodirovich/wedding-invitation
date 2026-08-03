import { motion } from 'framer-motion'
import PageFrame from './PageFrame'
import PatternBand from '../PatternBand'
import { Divider } from '../Ornament'
import { Wreath } from '../Art'

/** 1-varaq: ochilish oynasi */
export default function CoverPage({ couple, cover, onOpen }) {
  return (
    <PageFrame image={cover?.image} fit="cover" veil={0.1} glow={0.75} className="!px-[9%] !py-[9%]">
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
        <div className="relative mb-6 flex size-28 items-center justify-center sm:size-36">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <Wreath className="h-full w-full text-gold/85" />
          </motion.div>
          <span
            aria-hidden="true"
            className="absolute inset-[18%] rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(255,252,253,0.9), rgba(255,252,253,0))',
            }}
          />
          <span className="relative font-display text-2xl italic tracking-wide text-gold sm:text-3xl">
            {couple.monogram}
          </span>
        </div>

        <p className="eyebrow mb-5">Taklifnoma</p>

        {/* Ismlar alohida qatorda — uzun ism ham to'liq sig'adi */}
        <h1 className="flex flex-col items-center font-display leading-[1.08] font-light tracking-wide text-ink">
          <span className="text-[clamp(1.9rem,9.5vw,3.1rem)]">{couple.groom}</span>
          <span className="my-1.5 text-[clamp(1.05rem,4vw,1.5rem)] italic text-gold">&</span>
          <span className="text-[clamp(1.9rem,9.5vw,3.1rem)]">{couple.bride}</span>
        </h1>

        <Divider className="my-7" width={150} color="var(--color-gold)" />

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
