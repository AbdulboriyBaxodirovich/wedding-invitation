import { asset } from '../../lib/asset'

/**
 * Sahifaning umumiy asosi: fon rasmi, ustidan yumshoq pushti parda va
 * matn uchun xavfsiz maydon (ramka bezagiga tegib ketmasligi uchun).
 */
export default function PageFrame({
  image,
  // 'fill' — rasm butun varaqqa cho'ziladi (bezakli ramka uchun),
  // 'cover' — nisbatini saqlab qirqiladi (oddiy fotolar uchun)
  fit = 'fill',
  veil = 0.22,
  glow = 0.5,
  children,
  className = '',
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      {image && (
        <img
          src={asset(image)}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-fill'}`}
        />
      )}

      {/* Pushti parda + markazdagi yorug'lik: matn aniq o'qilishi uchun */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 42% at 50% 50%, rgba(255,252,253,${glow}) 0%, rgba(255,252,253,0) 100%),
            linear-gradient(rgba(252,232,240,${veil}), rgba(252,232,240,${veil}))
          `,
        }}
      />

      <div
        className={`relative flex flex-1 flex-col items-center justify-center px-[13%] py-[11%] text-center ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
