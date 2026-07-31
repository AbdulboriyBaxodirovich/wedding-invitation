import { useMemo } from 'react'

const PETAL_COUNT = 14

/**
 * Fon qatlami: yorug'lik halqasi, qog'oz donadorligi va yuqoriga
 * suzuvchi gulbarglar. Gulbarglar faqat CSS animatsiyasi bilan
 * harakatlanadi — React har kadrda qayta render qilmaydi.
 */
export default function AmbientBackdrop() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 7.3 + ((i * 37) % 11)) % 96}%`,
        size: 5 + ((i * 13) % 7),
        duration: 20 + ((i * 17) % 14),
        delay: -((i * 31) % 30),
        driftX: `${((i % 5) - 2) * 26}px`,
        opacity: 0.18 + ((i * 7) % 4) * 0.06,
      })),
    []
  )

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Yumshoq yorug'lik */}
      <div className="halo absolute inset-0" />

      {/* Burchaklardagi issiq soya */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_55%,rgba(185,155,107,0.10)_100%)]" />

      {/* Suzuvchi gulbarglar */}
      {petals.map((p) => (
        <span
          key={p.id}
          className="animate-drift absolute -bottom-12 rounded-[50%_0_50%_0] bg-gold"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift-x': p.driftX,
            '--drift-opacity': p.opacity,
          }}
        />
      ))}

      {/* Qog'oz donadorligi */}
      <div className="grain absolute inset-0" />
    </div>
  )
}
